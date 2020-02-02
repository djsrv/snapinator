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

export default class Primitive {
    value: any;
    isOption: boolean;

    constructor(value: any, isOption = false) {
        this.value = value;
        this.isOption = isOption;
    }

    toString(): string {
        return this.value.toString();
    }

    toXML(): Element {
        if (this.isOption) {
            return <l><option>{this.value}</option></l>;
        }
        if (typeof this.value === 'boolean') {
            if (this.value) {
                return <l><bool>true</bool></l>;
            }
            return <l/>;
        }
        if (this.value == null) {
            return <l/>;
        }
        return <l>{this.value}</l>;
    }
}
