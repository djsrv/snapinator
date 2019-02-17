import ImageFile from '../media/ImageFile';
import Project from '../Project';

export default class Costume {
    name: string;
    file: ImageFile;
    textFile: ImageFile;
    rotationCenterX: number;
    rotationCenterY: number;

    readSB2(jsonObj: any, project: Project): Costume {
        this.name = jsonObj.costumeName;
        this.file = project.media[jsonObj.baseLayerMD5] as ImageFile;
        if (jsonObj.text != null) {
            this.textFile = project.media[jsonObj.textLayerMD5] as ImageFile;
        }
        this.rotationCenterX = jsonObj.rotationCenterX / jsonObj.bitmapResolution;
        this.rotationCenterY = jsonObj.rotationCenterY / jsonObj.bitmapResolution;

        return this;
    }
}
