/*

    Snapinator
    Copyright (C) 2020  Deborah Servilla

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

export default class List {
    contents: any[];

    constructor(contents: any[]) {
        this.contents = contents;
    }

    toXML(): Element {
        return <list struct="atomic">
            {this.contents.map(this.encodeCell).join(',')}
        </list>;
    }

    // Adapted from lists.js in Snap!
    encodeCell(atomicValue: any) {
        const str = atomicValue.toString();
        let cell: string[];
        if (str.indexOf('\"') ===  -1 &&
                (str.indexOf('\n') === -1) &&
                (str.indexOf('\,') === -1)) {
            return str;
        }
        cell = ['\"'];
        str.split('').forEach((letter) => {
            cell.push(letter);
            if (letter === '\"') {
                cell.push(letter);
            }
        });
        cell.push('\"');
        return cell.join('');
    }
}
