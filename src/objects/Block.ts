import { SB2_TO_SB3_OP_MAP } from '../data/SB2Data';
import {
    OBJECT_NAMES,
    SB3_ARG_MAPS,
    SB3_CONSTANTS,
    SB3_TO_SNAP_OP_MAP,
    SB3_VAR_TYPES,
} from '../data/SB3Data';
import XMLDoc from '../XMLDoc';
import Color from './Color';
import Primitive from './Primitive';
import Script from './Script';
import ScriptComment from './ScriptComment';
import VariableFrame from './VariableFrame';

const SPECIAL_CASE_ARGS = {
    'motion_pointtowards': {},
    'motion_goto': {},
    'motion_glideto': {},
    'pen_changePenColorParamBy': {},
    'pen_setPenColorParamTo': {},
    'event_whenkeypressed': {},
    'control_stop': {},
    'control_create_clone_of': {},
    'sensing_touchingobject': {},
    'sensing_distanceto': {},
    'sensing_keypressed': {},
    'videoSensing_videoOn': {},
    'sensing_of': {},
    'operator_mathop': {},
    'data_insertatlist': {},
    'data_replaceitemoflist': {},
    'data_itemoflist': {},
};

function handleObjArg(arg: any, choices: string[]) {
    if (choices.includes(arg.value)) {
        return new Primitive(OBJECT_NAMES[arg], true);
    }
    return arg;
}

SPECIAL_CASE_ARGS['motion_pointtowards'][0] =
SPECIAL_CASE_ARGS['sensing_distanceto'][0] = (arg: any) => {
    return handleObjArg(arg, ['_mouse_']);
};
SPECIAL_CASE_ARGS['motion_goto'][0] =
SPECIAL_CASE_ARGS['motion_glideto'][0] = (arg: any) => {
    return handleObjArg(arg, ['_mouse_', '_random_']);
};
SPECIAL_CASE_ARGS['control_create_clone_of'][0] = (arg: any) => {
    return handleObjArg(arg, ['_myself_']);
};
SPECIAL_CASE_ARGS['sensing_touchingobject'][0] = (arg: any) => {
    return handleObjArg(arg, ['_mouse_', '_edge_']);
};
SPECIAL_CASE_ARGS['videoSensing_videoOn'][0] = (arg: any) => {
    return handleObjArg(arg, ['this sprite']);
};

SPECIAL_CASE_ARGS['pen_changePenColorParamBy'][0] =
SPECIAL_CASE_ARGS['pen_setPenColorParamTo'][0] = (arg: any) => {
    if (arg.value === 'color') {
        return new Primitive('hue', true);
    }
    return arg;
};

SPECIAL_CASE_ARGS['event_whenkeypressed'][0] =
SPECIAL_CASE_ARGS['sensing_keypressed'][0] = (arg: any) => {
    if (arg.value === 'any') {
        return new Primitive('any key', true);
    }
    return arg;
};

SPECIAL_CASE_ARGS['control_stop'][0] = (arg: any) => {
    if (arg.value === 'other scripts in stage') {
        return new Primitive('other scripts in sprite', true);
    }
    return arg;
};

SPECIAL_CASE_ARGS['sensing_of'][0] = (arg: any) => {
    const OPTIONS = [
        'costume #', 'costume name', 'volume',
        'x position', 'y position', 'direction', 'size',
    ];

    if (arg.value === 'backdrop #' || arg.value === 'background #') {
        return new Primitive('costume #', true);
    } else if (arg.value === 'backdrop name') {
        return new Primitive('costume name', true);
    }
    if (OPTIONS.includes(arg.value)) {
        return new Primitive(arg.value, true);
    }
    return arg;
};
SPECIAL_CASE_ARGS['sensing_of'][1] = (arg: any) => {
    if (arg.value === '_stage_') {
        return new Primitive('Stage');
    }
    return arg;
};

SPECIAL_CASE_ARGS['operator_mathop'][0] = (arg: any) => {
    if (arg.value === 'e ^') {
        return new Primitive('e^', true);
    }
    if (arg.value === '10 ^') {
        return new Primitive('10^', true);
    }
    return arg;
};

SPECIAL_CASE_ARGS['data_insertatlist'][1] =
SPECIAL_CASE_ARGS['data_replaceitemoflist'][0] =
SPECIAL_CASE_ARGS['data_itemoflist'][0] = (arg: any) => {
    if (arg.value === 'random' || arg.value === 'any') {
        return new Primitive('any', true);
    }
    return arg;
};

export default class Block {
    static forVar(varName: string) {
        return new Block().initForVar(varName);
    }

    op: string;
    args: any[];
    comment?: ScriptComment;

    initForVar(varName: string) {
        this.op = 'data_variable';
        this.args = [new Primitive(varName)];
        return this;
    }

    readSB2(
        jsonArr: any[],
        nextBlockID: number,
        blockComments: ScriptComment[],
        variables: VariableFrame,
    ): [Block, number] {
        const blockID = nextBlockID;
        const sb2Op = jsonArr[0];
        this.op = SB2_TO_SB3_OP_MAP[sb2Op] || sb2Op;
        nextBlockID += 1;
        this.args = jsonArr.slice(1).map((argObj, argIndex) => {
            let arg;
            [arg, nextBlockID] = this.readArgSB2(argObj, argIndex, nextBlockID, blockComments, variables);
            return arg;
        });
        if (blockComments[blockID]) {
            this.comment = blockComments[blockID];
        }

        return [this, nextBlockID];
    }

    readArgSB2(
        arg: any,
        argIndex: number,
        nextBlockID: number,
        blockComments: ScriptComment[],
        variables: VariableFrame,
    ): [any, number] {
        let argSpec;
        if (SB3_ARG_MAPS[this.op] && SB3_ARG_MAPS[this.op][argIndex]) {
            argSpec = SB3_ARG_MAPS[this.op][argIndex];
        }

        if (argSpec && argSpec.type === 'input' && argSpec.inputOp === 'substack') {
            return new Script().readSB2(arg, nextBlockID, blockComments, variables, true);
        }
        if (Array.isArray(arg)) {
            return new Block().readSB2(arg, nextBlockID, blockComments, variables);
        }

        let value;
        if (argSpec && argSpec.type === 'field' && argSpec.variableType === SB3_VAR_TYPES.VAR_LIST_TYPE) {
            value = Block.forVar(variables.getListName(arg));
        } else if (argSpec && argSpec.type === 'input' && argSpec.inputOp === 'colour_picker') {
            value = Color.fromARGB(arg);
        } else if (typeof arg === 'string' && argSpec && argSpec.snapOptionInput) {
            value = new Primitive(arg, true);
        } else {
            value = new Primitive(arg);
        }
        if (SPECIAL_CASE_ARGS[this.op] && SPECIAL_CASE_ARGS[this.op][argIndex]) {
            value = SPECIAL_CASE_ARGS[this.op][argIndex](value);
        }
        return [value, nextBlockID];
    }

    readSB3(blockID: any, blockMap: any, variables: VariableFrame): Block {
        const jsonObj = blockMap[blockID];

        if (Array.isArray(jsonObj)) { // primitive array
            return this.readPrimitiveSB3(jsonObj, variables);
        }

        this.op = jsonObj.opcode;
        const argMap = SB3_ARG_MAPS[this.op];
        if (argMap) {
            this.args = argMap.map((argSpec, argIndex) => {
                return this.readArgSB3(jsonObj, argIndex, argSpec, blockMap, variables);
            });
        } else {
            this.args = [];
        }

        return this;
    }

    readPrimitiveSB3(jsonArr: any[], variables: VariableFrame): any {
        const type = jsonArr[0];
        const value = jsonArr[1];
        if (type === SB3_CONSTANTS.VAR_PRIMITIVE) {
            return this.initForVar(value);
        }
        if (type === SB3_CONSTANTS.LIST_PRIMITIVE) {
            return this.initForVar(variables.getListName(value));
        }
        return this;
    }

    readArgSB3(jsonObj: any, argIndex: number, argSpec: any, blockMap: any, variables: VariableFrame) {
        let value: any = new Primitive(null);
        if (argSpec.type === 'input') { // input (blocks can be dropped here)
            const argArr = jsonObj.inputs[argSpec.inputName];
            if (argArr) {
                const inputType = argArr[0];
                const inputValue = argArr[1];
                if (inputType === SB3_CONSTANTS.INPUT_SAME_BLOCK_SHADOW) {
                    // value is a primitive other than variable/list
                    if (typeof inputValue === 'string') { // dropdown menu id
                        const inputObj = blockMap[inputValue];
                        value = new Primitive(inputObj.fields[argSpec.inputName][0]);
                    } else if (Array.isArray(inputValue)) { // primitive array
                        if (argSpec.inputOp === 'colour_picker') {
                            value = Color.fromHex(inputValue[1]);
                        } else {
                            value = new Primitive(inputValue[1]);
                        }
                    }
                } else if (
                    inputType === SB3_CONSTANTS.INPUT_BLOCK_NO_SHADOW
                    || inputType === SB3_CONSTANTS.INPUT_DIFF_BLOCK_SHADOW
                ) {
                    // value is a substack or block (including variable/list primitives)
                    if (argSpec.inputOp === 'substack') {
                        return new Script().readSB3(inputValue, blockMap, variables, true);
                    } else if (Array.isArray(inputValue)) { // primitive array
                        return new Block().readPrimitiveSB3(inputValue, variables);
                    } else {
                        return new Block().readSB3(inputValue, blockMap, variables);
                    }
                }
            }
        } else { // field (blocks cannot be dropped here)
            const argArr = jsonObj.fields[argSpec.fieldName];
            value = new Primitive(argArr[0]);
        }
        if (SPECIAL_CASE_ARGS[this.op] && SPECIAL_CASE_ARGS[this.op][argIndex]) {
            value = SPECIAL_CASE_ARGS[this.op][argIndex](value);
        }
        return value;
    }

    toXML(xml: XMLDoc, forStage: boolean, variables: VariableFrame): Element {
        if (this.op === 'data_variable') {
            return xml.el('block', {var: this.args[0]});
        }
        const snapOp = SB3_TO_SNAP_OP_MAP[this.op] || this.op;
        if (!snapOp) {
            throw new Error('Unsupported block ' + this.op);
        }
        const children = this.args.map((arg) => {
            if (arg instanceof Block) {
                const block: Block = arg;
                return block.toXML(xml, forStage, variables);
            }
            return arg.toXML(xml);
        });
        if (this.comment) {
            children.push(this.comment.toXML(xml));
        }
        return xml.el('block', {s: snapOp}, children);
    }
}
