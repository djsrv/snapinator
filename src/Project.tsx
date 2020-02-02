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

import ImageFile from './media/ImageFile';
import MediaFile from './media/MediaFile';
import SoundFile from './media/SoundFile';
import Stage from './objects/Stage';
import VariableFrame from './objects/VariableFrame';
import { h } from './xml';
import BlockDefinition from './objects/BlockDefinition';

export default class Project {
    name: string;
    jsonObj: any;
    zip: any;
    log: (msg: any) => void;

    unsupportedOps: {[op: string]: boolean};
    media: {[id: string]: MediaFile};
    globalVars: VariableFrame;
    stage: Stage;

    async readProject(name: string, jsonObj: any, zip: any, log: (msg: any) => void) {
        this.name = name;
        this.jsonObj = jsonObj;
        this.zip = zip;
        this.log = log;

        this.unsupportedOps = {};
        if (this.jsonObj.children) { // Scratch 2.0 project
            this.media = await this.readMediaSB2();
            this.globalVars = new VariableFrame().readScriptableSB2(this.jsonObj);
            this.stage = new Stage().readSB2(this.jsonObj, this);
        } else if (this.jsonObj.targets) { // Scratch 3.0 project
            const stageObj = this.jsonObj.targets.find((obj) => obj.isStage);
            this.media = await this.readMediaSB3();
            this.globalVars = new VariableFrame().readScriptableSB3(stageObj);
            this.stage = new Stage().readProjectSB3(this.jsonObj, this);
        }
    }

    async getAsset(fileName: string): Promise<Uint8Array | string> {
        const file = this.zip.file(fileName);
        if (!file) {
            throw new Error(fileName + ' does not exist');
        }
        if (fileName.endsWith('.svg')) {
            return await file.async('text');
        }
        return await file.async('uint8array');
    };

    async readMediaSB2(): Promise<any> {
        const stageObj = this.jsonObj;
        const media = {};

        const readObj = async (jsonObj: any) => {
            const costumeObjs = jsonObj.costumes;
            const soundObjs = jsonObj.sounds;

            if (costumeObjs != null) {
                for (const costumeObj of costumeObjs) {
                    const baseLayerMD5Ext = costumeObj.baseLayerMD5;
                    const baseLayerExt = baseLayerMD5Ext.split('.')[1];
                    if (!media[baseLayerMD5Ext]) {
                        const baseLayerData = await this.getAsset(costumeObj.baseLayerID + '.' + baseLayerExt);
                        const baseLayerFile: ImageFile = new ImageFile(
                            baseLayerExt, baseLayerData, costumeObj.bitmapResolution,
                        );
                        await baseLayerFile.fixData(2);
                        media[baseLayerMD5Ext] = baseLayerFile;
                    }

                    if (costumeObj.text != null) {
                        const textLayerMD5Ext = costumeObj.textLayerMD5;
                        const textLayerExt = textLayerMD5Ext.split('.')[1];
                        if (!media[textLayerMD5Ext]) {
                            const textLayerData = await this.getAsset(costumeObj.textLayerID + '.' + textLayerExt);
                            const baseLayerFile: ImageFile = new ImageFile(
                                textLayerExt, textLayerData, costumeObj.bitmapResolution,
                            );
                            await baseLayerFile.fixData(2);
                            media[textLayerMD5Ext] = baseLayerFile;
                        }
                        const combinedMD5Ext = baseLayerMD5Ext + '+' + textLayerMD5Ext;
                        if (!media[combinedMD5Ext]) {
                            media[combinedMD5Ext] = await media[baseLayerMD5Ext].addTextLayer(media[textLayerMD5Ext]);
                        }
                    }
                }
            }

            if (soundObjs != null) {
                for (const soundObj of soundObjs) {
                    const md5Ext = soundObj.md5;
                    const ext = md5Ext.split('.')[1];
                    if (!media[md5Ext]) {
                        const data = await this.getAsset(soundObj.soundID + '.' + ext);
                        const file: SoundFile = new SoundFile(ext, data);
                        media[md5Ext] = file;
                    }
                }
            }
        };

        await readObj(stageObj);
        for (const child of stageObj.children) {
            if ('objName' in child) { // sprite
                await readObj(child);
            }
        }

        return media;
    }

    async readMediaSB3(): Promise<any> {
        const media = {};

        const readObj = async (jsonObj: any) => {
            const costumeObjs = jsonObj.costumes;
            const soundObjs = jsonObj.sounds;

            for (const costumeObj of costumeObjs) {
                const md5Ext = costumeObj.md5ext;
                if (!media[md5Ext]) {
                    const data = await this.getAsset(md5Ext);
                    const file: ImageFile = new ImageFile(
                        costumeObj.dataFormat, data, costumeObj.bitmapResolution,
                    );
                    await file.fixData(3);
                    media[md5Ext] = file;
                }
            }

            for (const soundObj of soundObjs) {
                const md5Ext = soundObj.md5ext;
                if (!media[md5Ext]) {
                    const data = await this.getAsset(md5Ext);
                    const file: SoundFile = new SoundFile(soundObj.dataFormat, data);
                    media[md5Ext] = file;
                }
            }
        };

        for (const child of this.jsonObj.targets) {
            await readObj(child);
        }

        return media;
    }

    unsupportedBlock(op: string, isReporter: boolean) {
        if (!this.unsupportedOps.hasOwnProperty(op)) {
            this.log(`Unsupported block: ${op}`);
            this.unsupportedOps[op] = isReporter;
        }
        return <custom-block s={'UNSUPPORTED: ' + op}/>
    }

    toXML() {
        return <project name={this.name} app="Snapinator" version="1">
            <notes>Converted by Snapinator</notes>
            {this.stage.toXML()}
            <hidden/>
            <headers/>
            <code/>
            <blocks>
                {Object.keys(this.unsupportedOps).map(
                    (op) => new BlockDefinition().placeholder('UNSUPPORTED: ' + op, this.unsupportedOps[op]).toXML(null)
                )}
            </blocks>
            {this.globalVars.toXML()}
        </project>;
    }
}
