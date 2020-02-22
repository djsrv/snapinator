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

    async readMediaSB2(): Promise<any> {
        const stageObj = this.jsonObj;
        const media = {};

        const readObj = async (jsonObj: any) => {
            const costumeObjs = jsonObj.costumes;
            const soundObjs = jsonObj.sounds;

            if (costumeObjs != null) {
                for (const costumeObj of costumeObjs) {
                    const baseLayerMD5Ext = costumeObj.baseLayerMD5;
                    const [baseLayerMD5, baseLayerExt] = baseLayerMD5Ext.split('.');
                    const baseLayerAssetID = this.zip instanceof AssetServer ? baseLayerMD5 : costumeObj.baseLayerID;
                    if (!media[baseLayerMD5Ext]) {
                        const baseLayerFile: ImageFile = await new ImageFile().load(
                            this.zip, baseLayerAssetID, baseLayerExt, 2, costumeObj.bitmapResolution
                        );
                        media[baseLayerMD5Ext] = baseLayerFile;
                    }

                    if (costumeObj.text != null) {
                        const textLayerMD5Ext = costumeObj.textLayerMD5;
                        const [textLayerMD5, textLayerExt] = textLayerMD5Ext.split('.');
                        const textLayerAssetID = this.zip instanceof AssetServer ? textLayerMD5 : costumeObj.textLayerID;
                        if (!media[textLayerMD5Ext]) {
                            const textLayerFile: ImageFile = await new ImageFile().load(
                                this.zip, textLayerAssetID, textLayerExt, 2, costumeObj.bitmapResolution
                            );
                            media[textLayerMD5Ext] = textLayerFile;
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
                    const [md5, ext] = md5Ext.split('.');
                    const assetID = this.zip instanceof AssetServer ? md5: soundObj.soundID;
                    if (!media[md5Ext]) {
                        const file: SoundFile = await new SoundFile().load(this.zip, assetID, ext);
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
                    const file: ImageFile = await new ImageFile().load(
                        this.zip, costumeObj.assetId, costumeObj.dataFormat, 3, costumeObj.bitmapResolution
                    );
                    media[md5Ext] = file;
                }
            }

            for (const soundObj of soundObjs) {
                const md5Ext = soundObj.md5ext;
                if (!media[md5Ext]) {
                    const file: SoundFile = await new SoundFile().load(this.zip, soundObj.assetId, soundObj.dataFormat);
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
