/*

    Snapinator
    Copyright (C) 2020  Dylan Servilla

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.

*/

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
