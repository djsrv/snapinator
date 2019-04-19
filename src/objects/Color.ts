export default class Color {
    static fromARGB(color: number): Color {
        const r = (color >> 16) & 0xff;
        const g = (color >> 8) & 0xff;
        const b = color & 0xff;
        const a = ((color >> 24) & 0xff) / 0xff;
        return  new Color(r, g, b, a);
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
        return Math.round(this.r) + ',' +
            Math.round(this.g) + ',' +
            Math.round(this.b) + ',' +
            this.a;
    }
}
