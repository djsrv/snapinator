import Color from './Color';

export default class Watcher {
    x: number;
    y: number;
    visible: boolean;

    target: string;
    cmd: string;
    param: string;
    color: Color;
    mode: WatcherMode;

    // slider
    min: number;
    max: number;
    discrete: boolean;

    // list
    listWidth: number;
    listHeight: number;
}

export enum WatcherMode {
    Normal,
    Large,
    Slider,
}
