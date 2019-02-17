import * as JSZip from 'jszip';
import ImageFile from './media/ImageFile';
import MediaFile from './media/MediaFile';
import SoundFile from './media/SoundFile';
import Stage from './objects/Stage';
import Variable from './objects/Variable';

export default class Project {
    zip: JSZip;
    jsonObj: any;

    name: string;
    notes: string;
    thumbnail: ImageFile;
    globalVars: Variable[];
    stage: Stage;
    media: {[id: string]: MediaFile};

    async readZip(zip: JSZip) {
        this.zip = zip;
        const jsonText = await this.zip.file('project.json').async('text');
        this.jsonObj = JSON.parse(jsonText);
        if (this.jsonObj.children) { // Scratch 2.0 project
            await this.readMediaSB2();
            this.globalVars = Variable.readVariablesSB2(this.jsonObj);
        }
    }

    async readMediaSB2() {
        const zip = this.zip;
        const stageObj = this.jsonObj;

        this.media = {};

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
            const costumes = jsonObj.costumes;
            const sounds = jsonObj.sounds;

            if (costumes != null) {
                for (const costumeObj of costumes) {
                    const [baseLayerMD5, baseLayerExt] = costumeObj.baseLayerMD5.split('.');
                    if (!this.media[baseLayerMD5]) {
                        const baseLayerData = await getAsset(costumeObj.baseLayerID, baseLayerExt);
                        const baseLayerFile: ImageFile = {
                            dataFormat: baseLayerExt,
                            data: baseLayerData,
                            resolution: costumeObj.bitmapResolution,
                        };
                        this.media[baseLayerMD5] = baseLayerFile;
                    }

                    if (costumeObj.text != null) {
                        const [textLayerMD5, textLayerExt] = costumeObj.textLayerMD5.split('.');
                        if (!this.media[textLayerMD5]) {
                            const textLayerData = await getAsset(costumeObj.textLayerID, textLayerExt);
                            const baseLayerFile: ImageFile = {
                                dataFormat: textLayerExt,
                                data: textLayerData,
                                resolution: costumeObj.bitmapResolution,
                            };
                            this.media[textLayerMD5] = baseLayerFile;
                        }
                    }
                }
            }

            if (sounds != null) {
                for (const soundObj of sounds) {
                    const [md5, ext] = stageObj.baseLayerMD5.split('.');
                    if (!this.media[md5]) {
                        const data = await getAsset(soundObj.soundID, ext);
                        const file: SoundFile = {
                            dataFormat: ext,
                            data,
                        };
                        this.media[md5] = file;
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
    }
}
