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

import AssetServer from './AssetServer';
import ProjectURLInput from './components/ProjectURLInput';
import Project from './Project';
import { serializeXML } from './xml';
import { h, Component, ComponentChild } from 'preact';
import * as JSZip from 'jszip';
import { SB1File } from 'scratch-sb1-converter';

export interface State {
    logs: ComponentChild[];
}

export default class SnapinatorApp extends Component<any, State> {
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
        return <div class="io">
            <div class="in box">
                <h1>Input</h1>
                <p>Paste a Scratch project URL or ID:</p>
                <ProjectURLInput onProjectID={this.handleProjectID.bind(this)}/>
                <p>Or load a project from a file:</p>
                <input class="file" type="file" onInput={this.handleFile.bind(this)}/>
            </div>
            <div class="out box">
                <h1>Output</h1>
                <ul class="log">{this.state.logs}</ul>
            </div>
        </div>;
    }

    log(msg: ComponentChild | Error) {
        console.log(msg);
        if (msg instanceof Error) {
            msg = msg.toString();
        }
        this.setState(({ logs }) => ({ logs: [...logs, <li>{msg}</li>] }));
    }

    async handleProjectID(projectID: string) {
        const response = await fetch(`https://projects.scratch.mit.edu/${projectID}`);
        if (!response.ok) {
            this.log(`Project "${projectID}" could not be retrieved`);
            return;
        }
        const file = await response.arrayBuffer();
        const project = await this.readProject(projectID, file);
        if (project) {
            this.writeProject(projectID, project);
        }
    }

    handleFile(e) {
        const file = e.target.files[0];
        const projectName = file.name.replace(/\..*$/, '');
        const reader = new FileReader();
        reader.addEventListener('load', async () => {
            const project = await this.readProject(projectName, reader.result as ArrayBuffer);
            if (project) {
                this.writeProject(projectName, project);
            }
        });
        reader.readAsArrayBuffer(file);
    }

    async readProject(projectName: string, file: ArrayBuffer): Promise<Project | null> {
        let zip
        let jsonObj;
        this.log(`Reading project "${projectName}"`);
        try {
            jsonObj = JSON.parse(
                new TextDecoder().decode(
                    new Uint8Array(file)
                )
            );
            zip = new AssetServer();
        } catch (err) {
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
        }
        const project = new Project();
        try {
            await project.readProject(projectName, jsonObj, zip, this.log.bind(this));
        } catch (err) {
            this.log(err);
            return null;
        }
        return project;
    }

    writeProject(projectName: string, project: Project) {
        this.log(<span>Writing Snap<i>!</i> XML</span>);
        try {
            const projectXML = serializeXML(project.toXML());
            const projectURL = URL.createObjectURL(new Blob([projectXML], {type: 'text/xml'}));
            const openInSnap = () => {
                window.open('https://snap.berkeley.edu/snap/snap.html#open:' + encodeURIComponent(projectXML), '_blank');
            };
            this.log(
                <span>
                    Success! <a href="#" onClick={openInSnap}>Click here to open your project in Snap<i>!</i></a> (your browser may block this link),
                    or <a href={projectURL} download={projectName + '.xml'}>click here to download your project.</a>
                </span>
            );
        } catch (err) {
            this.log(err.toString());
        }
    }
}
