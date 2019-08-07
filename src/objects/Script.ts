import { SB3_WORKSPACE_X_SCALE, SB3_WORKSPACE_Y_SCALE } from '../data/SB3Data';
import XMLDoc from '../XMLDoc';
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
        for (const blockArr of blockArrs) {
            let block;
            [block, nextBlockID] = new Block().readSB2(blockArr, nextBlockID, blockComments, variables);
            this.stack.push(block);
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

    toXML(xml: XMLDoc, scriptable: Scriptable, variables: VariableFrame): Element {
        const props: any = {};
        if (this.x != null && this.y != null) {
            props.x = this.x;
            props.y = this.y;
        }
        return xml.el('script', props, this.stack.map((block) => block.toXML(xml, scriptable, variables)));
    }
}
