import * as JSZip from 'jszip';
import ImageFile from './media/ImageFile';
import MediaFile from './media/MediaFile';
import SoundFile from './media/SoundFile';
import Stage from './objects/Stage';
import VariableFrame from './objects/VariableFrame';

export default class Project {
    zip: JSZip;
    jsonObj: any;

    name: string;
    notes: string;
    thumbnail: ImageFile;

    media: {[id: string]: MediaFile};
    globalVars: VariableFrame;
    stage: Stage;

    async readZip(zip: JSZip) {
        this.zip = zip;
        const jsonText = await this.zip.file('project.json').async('text');
        this.jsonObj = JSON.parse(jsonText);
        if (this.jsonObj.children) { // Scratch 2.0 project
            this.media = await this.readMediaSB2();
            this.globalVars = new VariableFrame().readScriptableSB2(this.jsonObj);
            this.stage = new Stage().readSB2(this.jsonObj, this);
        }
    }

    async readMediaSB2() {
        const zip = this.zip;
        const stageObj = this.jsonObj;
        const media = {};

        const getAsset = async (id: number, ext: string): Promise<Uint8Array> => {
            const fileName = id + '.' + ext;
            const file = zip.file(fileName);
            if (!file) {
                throw Error(fileName + ' does not exist');
            }
            const data = await file.async('uint8array');
            return data;
        };

        const readObj = async (jsonObj: any) => {
            const costumeObjs = jsonObj.costumes;
            const soundObjs = jsonObj.sounds;

            if (costumeObjs != null) {
                for (const costumeObj of costumeObjs) {
                    const baseLayerMD5Ext = costumeObj.baseLayerMD5;
                    const baseLayerExt = baseLayerMD5Ext.split('.')[1];
                    if (!media[baseLayerMD5Ext]) {
                        const baseLayerData = await getAsset(costumeObj.baseLayerID, baseLayerExt);
                        const baseLayerFile: ImageFile = {
                            dataFormat: baseLayerExt,
                            data: baseLayerData,
                            resolution: costumeObj.bitmapResolution,
                        };
                        media[baseLayerMD5Ext] = baseLayerFile;
                    }

                    if (costumeObj.text != null) {
                        const textLayerMD5Ext = costumeObj.textLayerMD5;
                        const textLayerExt = textLayerMD5Ext.split('.')[1];
                        if (!media[textLayerMD5Ext]) {
                            const textLayerData = await getAsset(costumeObj.textLayerID, textLayerExt);
                            const baseLayerFile: ImageFile = {
                                dataFormat: textLayerExt,
                                data: textLayerData,
                                resolution: costumeObj.bitmapResolution,
                            };
                            media[textLayerMD5Ext] = baseLayerFile;
                        }
                    }
                }
            }

            if (soundObjs != null) {
                for (const soundObj of soundObjs) {
                    const md5Ext = soundObj.md5;
                    const ext = md5Ext.split('.')[1];
                    if (!media[md5Ext]) {
                        const data = await getAsset(soundObj.soundID, ext);
                        const file: SoundFile = {
                            dataFormat: ext,
                            data,
                        };
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
}
