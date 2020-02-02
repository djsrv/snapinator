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

import { SB3_WORKSPACE_X_SCALE, SB3_WORKSPACE_Y_SCALE } from '../data/SB3Data';
import { h } from '../xml';

export default class ScriptComment {
    x?: number;
    y?: number;
    text: string;
    width: number;
    collapsed: boolean;

    readSB2(jsonArr: any[]): ScriptComment {
        const blockID = jsonArr[5];
        if (blockID === -1) {
            this.x = jsonArr[0];
            this.y = jsonArr[1];
        }
        this.text = jsonArr[6];
        this.width = jsonArr[2];
        this.collapsed = !jsonArr[4];

        return this;
    }

    readSB3(jsonObj: any): ScriptComment {
        const blockID = jsonObj.blockId;
        if (blockID === null) {
            this.x = jsonObj.x / SB3_WORKSPACE_X_SCALE;
            this.y = jsonObj.y / SB3_WORKSPACE_Y_SCALE;
        }
        this.text = jsonObj.text;
        this.width = jsonObj.width / SB3_WORKSPACE_X_SCALE;
        this.collapsed = jsonObj.minimized;

        return this;
    }

    toXML(): Element {
        if (this.x != null && this.y != null) {
            return <comment x={this.x} y={this.y} w={this.width} collapsed={this.collapsed}>
                {this.text}
            </comment>;
        }
        return <comment w={this.width} collapsed={this.collapsed}>
            {this.text}
        </comment>;
    }
}
