import Scriptable from './Scriptable';

export default class Sprite extends Scriptable {
    x: number;
    y: number;
    visible: boolean;
    size: number;
    direction: number;
    rotationStyle: RotationStyle;
    draggable: boolean;
    libraryIndex: number;
}

export enum RotationStyle {
    Normal,
    LeftRight,
    None,
}
