import { SB2_ROTATION_STYLES } from '../data/SB2Data';
import { SB3_ROTATION_STYLES } from '../data/SB3Data';
import Project from '../Project';
import { h } from '../xml';
import Color from './Color';
import Scriptable from './Scriptable';
import VariableFrame from './VariableFrame';

export default class Sprite extends Scriptable {
    x: number;
    y: number;
    hidden: boolean;
    scale: number;
    direction: number;
    rotationStyle: number;
    draggable: boolean;
    libraryIndex: number;

    readSB2(jsonObj: any, project: Project): Sprite {
        super.readSB2(jsonObj, project);

        this.x = jsonObj.scratchX;
        this.y = jsonObj.scratchY;
        this.hidden = !jsonObj.visible;
        this.scale = jsonObj.scale;
        this.direction = jsonObj.direction;
        this.rotationStyle = SB2_ROTATION_STYLES[jsonObj.rotationStyle] || 1;
        this.draggable = jsonObj.isDraggable;
        this.libraryIndex = jsonObj.indexInLibrary;

        return this;
    }

    readVariablesSB2(jsonObj: any, project: Project) {
        this.variables = new VariableFrame(project.globalVars).readScriptableSB2(jsonObj);
    }

    readSB3(jsonObj: any, project: Project, libraryIndex: number): Sprite {
        super.readSB3(jsonObj, project, libraryIndex);

        this.x = jsonObj.x;
        this.y = jsonObj.y;
        this.hidden = !jsonObj.visible;
        this.scale = jsonObj.size / 100;
        this.direction = jsonObj.direction;
        this.rotationStyle = SB3_ROTATION_STYLES[jsonObj.rotationStyle] || 1;
        this.draggable = jsonObj.draggable;
        this.libraryIndex = libraryIndex;

        return this;
    }

    readVariablesSB3(jsonObj: any, project: Project) {
        this.variables = new VariableFrame(project.globalVars).readScriptableSB3(jsonObj);
    }

    toXML(): Element {
        const props: any = {
            name: this.name,
            idx: this.libraryIndex,
            x: this.x,
            y: this.y,
            heading: this.direction,
            scale: this.scale,
            rotation: this.rotationStyle,
            draggable: this.draggable,
            costume: this.costumeIndex,
            color: new Color(0, 0, 255), // Scratch's default pen color
            pen: 'middle',
        };
        if (this.hidden) {
            props.hidden = true;
        }

        return <sprite {...props}>{[
            this.costumesXML(),
            this.soundsXML(),
            this.variables.toXML(),
            this.blocksXML(),
            this.scriptsXML(),
        ]}</sprite>;
    }
}
