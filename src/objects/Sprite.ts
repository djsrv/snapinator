import Project from '../Project';
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
        const rotationStyles = {
            normal: 1,
            leftRight: 2,
            none: 0,
        };

        super.readSB2(jsonObj, project);
        this.variables = new VariableFrame(project.globalVars).readScriptableSB2(this);

        this.x = jsonObj.scratchX;
        this.y = jsonObj.scratchY;
        this.hidden = !jsonObj.visible;
        this.scale = jsonObj.scale;
        this.direction = jsonObj.direction;
        this.rotationStyle = rotationStyles[jsonObj.rotationStyle] || 1;
        this.draggable = jsonObj.isDraggable;
        this.libraryIndex = jsonObj.indexInLibrary;

        return this;
    }
}
