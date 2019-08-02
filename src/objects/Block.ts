import { SB2_TO_SB3_OP_MAP } from '../data/SB2Data';
import { C_ARGS, SB3_TO_SNAP_OP_MAP } from '../data/SB3Data';
import XMLDoc from '../XMLDoc';
import Primitive from './Primitive';
import Script from './Script';
import Scriptable from './Scriptable';
import ScriptComment from './ScriptComment';
import VariableFrame from './VariableFrame';

export default class Block {
    op: string;
    args: any[];
    comment?: ScriptComment;

    readSB2(jsonObj: any[], nextBlockID: number, blockComments: ScriptComment[]): [Block, number] {
        const blockID = nextBlockID;
        const sb2Op = jsonObj[0];
        this.op = SB2_TO_SB3_OP_MAP[sb2Op] || sb2Op;
        console.log('START BLOCK')
        console.log(nextBlockID, this.op);
        nextBlockID += 1;
        this.args = jsonObj.slice(1).map((argObj, argIndex) => {
            let arg;
            [arg, nextBlockID] = this.readArgSB2(argObj, argIndex, nextBlockID, blockComments);
            return arg;
        });
        console.log('END BLOCK');
        if (blockComments[blockID]) {
            this.comment = blockComments[blockID];
        }

        return [this, nextBlockID];
    }

    readArgSB2(jsonObj: any, argIndex: number, nextBlockID: number, blockComments: ScriptComment[]): [any, number] {
        if (C_ARGS[this.op] && C_ARGS[this.op].includes(argIndex)) {
            return new Script().readSB2(jsonObj, nextBlockID, blockComments, true);
        }
        if (Array.isArray(jsonObj)) {
            return new Block().readSB2(jsonObj, nextBlockID, blockComments);
        }
        // TODO: Actually process args
        console.log(jsonObj);
        return [new Primitive(jsonObj), nextBlockID];
    }

    toXML(xml: XMLDoc, scriptable: Scriptable, variables: VariableFrame): Element {
        const snapOp = SB3_TO_SNAP_OP_MAP[this.op] || this.op;
        if (!snapOp) {
            throw new Error('Unsupported block ' + this.op);
        }
        const children = this.args.map((arg) => {
            if (arg instanceof Block) {
                const block: Block = arg;
                return block.toXML(xml, scriptable, variables);
            }
            return arg.toXML(xml);
        });
        if (this.comment) {
            children.push(this.comment.toXML(xml));
        }
        return xml.el('block', {s: snapOp}, children);
    }
}
