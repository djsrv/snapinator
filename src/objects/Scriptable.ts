import Project from '../Project';
import Costume from './Costume';
import Script from './Script';
import Sound from './Sound';
import Variable from './Variable';

export default class Scriptable {
    name: string;
    variables: Variable[];
    scripts: Script[];
    costumes: Costume[];
    sounds: Sound[];
    costumeIndex: number;

    readSB2(jsonObj: any, project: Project): Scriptable {
        const costumeObjs = jsonObj.costumes;
        const soundObjs = jsonObj.sounds;

        this.name = jsonObj.objName;
        this.variables = [];
        this.costumes = [];
        if (costumeObjs != null) {
            for (const costumeObj of costumeObjs) {
                this.costumes.push(new Costume().readSB2(costumeObj, project));
            }
        }
        this.sounds = [];
        if (soundObjs != null) {
            for (const soundObj of soundObjs) {
                this.sounds.push(new Sound().readSB2(soundObj, project));
            }
        }
        this.costumeIndex = jsonObj.currentCostumeIndex;

        return this;
    }
}
