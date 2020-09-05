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
import Block from './Block';
import Scriptable from './Scriptable';
import ScriptComment from './ScriptComment';
import VariableFrame from './VariableFrame';

export default class Script {
    x?: number;
    y?: number;
    stack: Block[];

    constructor() {
        this.stack = [];
    }

    readSB2(
        jsonArr: any[],
        nextBlockID: number,
        blockComments: ScriptComment[],
        variables: VariableFrame,
        embedded: boolean = false,
    ): [Script, number] {
        let blockArrs;
        if (embedded) {
            blockArrs = jsonArr;
        } else {
            this.x = jsonArr[0];
            this.y = jsonArr[1];
            blockArrs = jsonArr[2];
        }
        if (jsonArr) {
            for (const blockArr of blockArrs) {
                let block;
                [block, nextBlockID] = new Block().readSB2(blockArr, nextBlockID, blockComments, variables);
                this.stack.push(block);
            }
        }

        return [this, nextBlockID];
    }

    readSB3(
        blockID: string,
        blockMap: any,
        blockComments: {[s: string]: ScriptComment},
        variables: VariableFrame,
        embedded: boolean = false,
    ): Script {
        let blockObj: any = blockMap[blockID];
        if (!embedded) {
            if (Array.isArray(blockObj)) {
                this.x = blockObj[3] / SB3_WORKSPACE_X_SCALE;
                this.y = blockObj[4] / SB3_WORKSPACE_Y_SCALE;
            } else {
                this.x = blockObj.x / SB3_WORKSPACE_X_SCALE;
                this.y = blockObj.y / SB3_WORKSPACE_Y_SCALE;
            }
        }
        while (blockID) {
            this.stack.push(new Block().readSB3(blockID, blockMap, blockComments, variables));
            if (!Array.isArray(blockObj) && blockObj.next) {
                blockID = blockObj.next;
                blockObj = blockMap[blockObj.next];
            } else {
                blockID = null;
                blockObj = null;
            }
        }

        return this;
    }

    toXML(scriptable: Scriptable): Element {
        const stack = this.stack.map((block) => block.toXML(scriptable));
        if (this.x != null && this.y != null) {
            return <script x={this.x} y={this.y}>{stack}</script>
        }
        return <script>{stack}</script>
    }

    hasBlock(op: string): boolean {
        for (const block of this.stack) {
            if (block.hasBlock(op)) {
                return true;
            }
        }
        return false;
    }
}
