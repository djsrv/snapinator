import { h } from '../xml';

export default class Color {
    static fromARGB(color: number): Color {
        const r = (color >> 16) & 0xff;
        const g = (color >> 8) & 0xff;
        const b = color & 0xff;
        const a = ((color >> 24) & 0xff) / 0xff || 1;
        return new Color(r, g, b, a);
    }

    static fromHex(color: string): Color {
        const r = parseInt(color.substr(1, 2), 16);
        const g = parseInt(color.substr(3, 2), 16);
        const b = parseInt(color.substr(5, 2), 16);
        const a = 1;
        return new Color(r, g, b, a);
    }

    r: number;
    g: number;
    b: number;
    a: number;

    constructor(r: number = 0, g: number = 0, b: number = 0, a: number = 1) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }

    toString(): string {
        return Math.round(this.r) + ','
            + Math.round(this.g) + ','
            + Math.round(this.b) + ','
            + this.a;
    }

    toXML() {
        return <color>{this.toString()}</color>;
    }
}
