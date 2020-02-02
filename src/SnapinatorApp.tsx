/*

    Snapinator
    Copyright (C) 2020  Dylan Servilla

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.

*/

import Project from './Project';
import { serializeXML } from './xml';
import { h, Component, ComponentChild } from 'preact';
import * as JSZip from 'jszip';
import { SB1File } from 'scratch-sb1-converter';

export interface SnapinatorState {
    logs: ComponentChild[];
}

export default class SnapinatorApp extends Component<any, SnapinatorState> {
    state: SnapinatorState;

    constructor() {
        super();
        this.state = {
            logs: [],
        };
    }

    componentDidMount() {
        this.log('Waiting for input...');
    }

    render() {
        return <div id="io">
            <div id="in" class="box">
                <h1>Input</h1>
                <p>Select a Scratch project: <input type="file" onInput={this.handleFile.bind(this)}/></p>
            </div>
            <div id="out" class="box">
                <h1>Output</h1>
                <ul id="log">{this.state.logs}</ul>
            </div>
        </div>;
    }

    log(msg: ComponentChild) {
        console.log(msg);
        this.setState(({ logs }) => ({ logs: [...logs, <li>{msg}</li>] }));
    }

    handleFile(e) {
        const file = e.target.files[0];
        const projectName = file.name.replace(/\..*$/, '');
        const reader = new FileReader();
        this.log(`Reading project "${projectName}"`);
        reader.addEventListener('load', async () => {
            const project = await this.readProject(projectName, reader.result as ArrayBuffer);
            console.log(project);
            if (project instanceof Project) {
                this.log(<span>Writing Snap<i>!</i> XML</span>);
                try {
                    const projectXML = serializeXML(project.toXML());
                    const projectURL = URL.createObjectURL(new Blob([projectXML], {type: 'text/xml'}));
                    this.log(<span>Success! <a href={projectURL} download={projectName + '.xml'}>Click here to download your project.</a></span>);
                } catch (err) {
                    this.log(err.toString());
                }
            }
        });
        reader.readAsArrayBuffer(file);
    }

    async readProject(name: string, file: ArrayBuffer): Promise<Project | null> {
        let zip
        let jsonObj;
        try {
            zip = await JSZip.loadAsync(file);
            const jsonText = await zip.file('project.json').async('text');
            jsonObj = JSON.parse(jsonText);
        } catch (err) {
            try {
                const sb1 = new SB1File(file);
                jsonObj = sb1.json;
                zip = sb1.zip;
            } catch (err) {
                this.log('Invalid project');
                return null;
            }
        }
        const project = new Project();
        try {
            await project.readProject(name, jsonObj, zip, this.log.bind(this));
        } catch (err) {
            this.log(err.toString());
        }
        return project;
    }
}
