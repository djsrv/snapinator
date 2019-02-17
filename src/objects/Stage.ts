import Project from '../Project';
import Scriptable from './Scriptable';
import Sprite from './Sprite';
import Watcher from './Watcher';

export default class Stage extends Scriptable {
    tempo: number;
    children: Array<Sprite | Watcher>;

    readSB2(jsonObj: any, project: Project): Stage {
        const childObjs  = jsonObj.children;

        super.readSB2(jsonObj, project);
        this.tempo = jsonObj.tempoBPM;
        this.children = [];
        if (childObjs != null) {
            for (const childObj of childObjs) {
                if (childObj.objName != null) { // sprite
                    this.children.push(new Sprite().readSB2(childObj, project));
                }
            }
        }

        return this;
    }
}
