import ImageFile from '../media/ImageFile';
import Project from '../Project';
import XMLDoc from '../XMLDoc';

export default class Costume {
    name: string;
    file: ImageFile;
    rotationCenterX: number;
    rotationCenterY: number;

    readSB2(jsonObj: any, project: Project): Costume {
        this.name = jsonObj.costumeName;
        if (jsonObj.text != null) {
            this.file = project.media[jsonObj.baseLayerMD5 + '+' + jsonObj.textLayerMD5] as ImageFile;
        } else {
            this.file = project.media[jsonObj.baseLayerMD5] as ImageFile;
        }
        this.rotationCenterX = jsonObj.rotationCenterX / jsonObj.bitmapResolution;
        this.rotationCenterY = jsonObj.rotationCenterY / jsonObj.bitmapResolution;

        return this;
    }

    readSB3(jsonObj: any, project: Project): Costume {
        this.name = jsonObj.name;
        this.file = project.media[jsonObj.md5ext] as ImageFile;
        this.rotationCenterX = jsonObj.rotationCenterX / jsonObj.bitmapResolution;
        this.rotationCenterY = jsonObj.rotationCenterY / jsonObj.bitmapResolution;

        return this;
    }

    toXML(xml: XMLDoc): Element {
        return xml.el('costume', {
            'name': this.name,
            'center-x': this.rotationCenterX,
            'center-y': this.rotationCenterY,
            'image': this.file.toDataURL(),
        });
    }
}
