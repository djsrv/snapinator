import Project from '../Project';
import XMLDoc from '../XMLDoc';
import Scriptable from './Scriptable';
import Sprite from './Sprite';
import VariableFrame from './VariableFrame';
import Watcher from './Watcher';

export default class Stage extends Scriptable {
    tempo: number;
    // children: Array<Sprite | Watcher>;
    children: Sprite[];

    readSB2(jsonObj: any, project: Project): Stage {
        const childObjs  = jsonObj.children;

        super.readSB2(jsonObj, project);
        this.variables = new VariableFrame(project.globalVars);

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

    toXML(xml: XMLDoc): Element {
        return xml.el('stage', {
            name: this.name,
            width: 480,
            height: 360,
            costume: this.costumeIndex,
            tempo: this.tempo,
            threadsafe: false,
            lines: 'round',
            codify: false,
            scheduled: false,
        }, [
            this.costumesXML(xml),
            this.soundsXML(xml),
            xml.el('variables'),
            this.blocksXML(xml),
            this.scriptsXML(xml),
            xml.el('sprites', null, this.children.map((child) => child.toXML(xml))),
        ]);
    }
}
