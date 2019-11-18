import { SB2_TO_SB3_OP_MAP } from '../data/SB2Data';
import {
    OBJECT_NAMES,
    SB3_ARG_MAPS,
    SB3_CONSTANTS,
    SB3_TO_SNAP_OP_MAP,
    SB3_VAR_TYPES,
} from '../data/SB3Data';
import XMLDoc from '../XMLDoc';
import BlockDefinition from './BlockDefinition';
import Color from './Color';
import Primitive from './Primitive';
import Script from './Script';
import Scriptable from './Scriptable';
import ScriptComment from './ScriptComment';
import Stage from './Stage';
import VariableFrame from './VariableFrame';

const SPECIAL_CASE_ARGS = {
    'motion_pointtowards': {},
    'motion_goto': {},
    'motion_glideto': {},
    'looks_changeeffectby': {},
    'looks_seteffectto': {},
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
    'sensing_current': {},
    'operator_mathop': {},
    'data_insertatlist': {},
    'data_replaceitemoflist': {},
    'data_itemoflist': {},
};

function handleObjArg(arg: Primitive, choices: string[]) {
    if (choices.includes(arg.value)) {
        return new Primitive(OBJECT_NAMES[arg.value], true);
    }
    return arg;
}

SPECIAL_CASE_ARGS['motion_pointtowards'][0] =
SPECIAL_CASE_ARGS['sensing_distanceto'][0] = (arg: Primitive) => {
    return handleObjArg(arg, ['_mouse_']);
};
SPECIAL_CASE_ARGS['motion_goto'][0] =
SPECIAL_CASE_ARGS['motion_glideto'][0] = (arg: Primitive) => {
    return handleObjArg(arg, ['_mouse_', '_random_']);
};
SPECIAL_CASE_ARGS['control_create_clone_of'][0] = (arg: Primitive) => {
    return handleObjArg(arg, ['_myself_']);
};
SPECIAL_CASE_ARGS['sensing_touchingobject'][0] = (arg: Primitive) => {
    return handleObjArg(arg, ['_mouse_', '_edge_']);
};
SPECIAL_CASE_ARGS['videoSensing_videoOn'][0] = (arg: Primitive) => {
    return handleObjArg(arg, ['this sprite']);
};

SPECIAL_CASE_ARGS['looks_changeeffectby'][0] =
SPECIAL_CASE_ARGS['looks_seteffectto'][0] = (arg: Primitive) => {
    return new Primitive(arg.value.toLowerCase(), true);
};

SPECIAL_CASE_ARGS['pen_changePenColorParamBy'][0] =
SPECIAL_CASE_ARGS['pen_setPenColorParamTo'][0] = (arg: Primitive) => {
    if (arg.value === 'color') {
        return new Primitive('hue', true);
    }
    return arg;
};

SPECIAL_CASE_ARGS['event_whenkeypressed'][0] =
SPECIAL_CASE_ARGS['sensing_keypressed'][0] = (arg: Primitive) => {
    if (arg.value === 'any') {
        return new Primitive('any key', true);
    }
    return arg;
};

SPECIAL_CASE_ARGS['control_stop'][0] = (arg: Primitive) => {
    if (arg.value === 'other scripts in stage') {
        return new Primitive('other scripts in sprite', true);
    }
    return arg;
};

SPECIAL_CASE_ARGS['sensing_of'][0] = (arg: Primitive) => {
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
SPECIAL_CASE_ARGS['sensing_of'][1] = (arg: Primitive) => {
    if (arg.value === '_stage_') {
        return new Primitive('Stage');
    }
    return arg;
};

SPECIAL_CASE_ARGS['sensing_current'][0] = (arg: Primitive) => {
    if (arg.value === 'DAYOFWEEK') {
        return new Primitive('day of week', true);
    }
    return new Primitive(arg.value.toLowerCase(), true);
};

SPECIAL_CASE_ARGS['operator_mathop'][0] = (arg: Primitive) => {
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
SPECIAL_CASE_ARGS['data_itemoflist'][0] = (arg: Primitive) => {
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
    spec: string;
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
        let argObjs = jsonArr.slice(1);
        if (this.op === 'procedures_call') {
            this.spec = BlockDefinition.convertSemanticSpec(argObjs[0]);
            argObjs = argObjs.slice(1);
        }
        this.args = argObjs.map((argObj, argIndex) => {
            let arg: any;
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
        if (argSpec && argSpec.type === 'field' && argSpec.variableType === SB3_VAR_TYPES.VAR_LIST_TYPE) {
            return [Block.forVar(variables.getListName(arg)), nextBlockID];
        }
        if (argSpec && argSpec.type === 'input' && argSpec.inputOp === 'colour_picker') {
            return [Color.fromARGB(arg), nextBlockID];
        }

        let value: Primitive;
        if (typeof arg === 'string' && argSpec && argSpec.snapOptionInput) {
            value = new Primitive(arg, true);
        } else {
            value = new Primitive(arg);
        }
        if (SPECIAL_CASE_ARGS[this.op] && SPECIAL_CASE_ARGS[this.op][argIndex]) {
            value = SPECIAL_CASE_ARGS[this.op][argIndex](value);
        }
        return [value, nextBlockID];
    }

    readSB3(
        blockID: string,
        blockMap: any,
        blockComments: {[s: string]: ScriptComment},
        variables: VariableFrame,
    ): Block {
        const jsonObj = blockMap[blockID];

        if (Array.isArray(jsonObj)) { // primitive array
            return this.readPrimitiveSB3(jsonObj, variables);
        }

        this.op = jsonObj.opcode;
        if (this.op === 'procedures_call') {
            this.spec = BlockDefinition.convertSemanticSpec(jsonObj.mutation.proccode);
            const argIDs = JSON.parse(jsonObj.mutation.argumentids);
            this.args = argIDs.map((argID, argIndex) => {
                const argSpec = {
                    type: 'input',
                    inputName: argID,
                };
                return this.readArgSB3(jsonObj, argIndex, argSpec, blockMap, blockComments, variables);
            });
        } else {
            const argMap = SB3_ARG_MAPS[this.op];
            if (argMap) {
                this.args = argMap.map((argSpec, argIndex) => {
                    return this.readArgSB3(jsonObj, argIndex, argSpec, blockMap, blockComments, variables);
                });
            } else {
                this.args = [];
            }
        }
        if (blockComments[blockID]) {
            this.comment = blockComments[blockID];
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

    readArgSB3(
        jsonObj: any,
        argIndex: number,
        argSpec: any,
        blockMap: any,
        blockComments: {[s: string]: ScriptComment},
        variables: VariableFrame,
    ) {
        let value: Primitive;
        if (argSpec.type === 'input') { // input (blocks can be dropped here)
            const argArr = jsonObj.inputs[argSpec.inputName];
            if (argArr) {
                const inputType = argArr[0];
                const inputValue = argArr[1];
                if (inputType === SB3_CONSTANTS.INPUT_SAME_BLOCK_SHADOW) {
                    // value is a primitive other than variable/list
                    if (typeof inputValue === 'string') { // dropdown menu id
                        const inputObj = blockMap[inputValue];
                        const fieldName = Object.keys(inputObj.fields)[0];
                        value = inputObj.fields[fieldName][0];
                    } else if (Array.isArray(inputValue)) { // primitive array
                        if (argSpec.inputOp === 'colour_picker') {
                            return Color.fromHex(inputValue[1]);
                        } else {
                            value = inputValue[1];
                        }
                    }
                } else if (
                    inputType === SB3_CONSTANTS.INPUT_BLOCK_NO_SHADOW
                    || inputType === SB3_CONSTANTS.INPUT_DIFF_BLOCK_SHADOW
                ) {
                    // value is a substack or block (including variable/list primitives)
                    if (argSpec.inputOp === 'substack') {
                        return new Script().readSB3(inputValue, blockMap, blockComments, variables, true);
                    } else if (Array.isArray(inputValue)) { // primitive array
                        return new Block().readPrimitiveSB3(inputValue, variables);
                    } else {
                        return new Block().readSB3(inputValue, blockMap, blockComments, variables);
                    }
                }
            } else if (argSpec.inputOp === 'substack') { // empty substack
                return new Script();
            }
        } else { // field (blocks cannot be dropped here)
            const argArr = jsonObj.fields[argSpec.fieldName];
            if (argSpec.variableType === SB3_VAR_TYPES.VAR_LIST_TYPE) {
                return Block.forVar(variables.getListName(argArr[0]));
            } else {
                value = argArr[0];
            }
        }
        if (typeof value === 'string' && argSpec.snapOptionInput) {
            value = new Primitive(value, true);
        } else {
            value = new Primitive(value);
        }
        if (SPECIAL_CASE_ARGS[this.op] && SPECIAL_CASE_ARGS[this.op][argIndex]) {
            value = SPECIAL_CASE_ARGS[this.op][argIndex](value);
        }
        return value;
    }

    toXML(xml: XMLDoc, scriptable: Scriptable, variables: VariableFrame): Element {
        const argToXML = (arg: any) => {
            if (arg instanceof Script) {
                const script: Script = arg;
                return script.toXML(xml, scriptable, variables);
            }
            if (arg instanceof Block) {
                const block: Block = arg;
                return block.toXML(xml, scriptable, variables);
            }
            return arg.toXML(xml);
        };

        const tellStageTo = (block: any) => {
            return xml.el('block', {s: 'doTellTo'}, [
                xml.el('l', null, 'Stage'),
                xml.el('block', {s: 'reifyScript'}, [
                    xml.el('script', null, [
                        block,
                    ]),
                    xml.el('list'),
                ]),
                xml.el('list'),
            ]);
        }

        const SPECIAL_CASE_BLOCKS: any = {};

        SPECIAL_CASE_BLOCKS['data_variable'] = () => {
            return xml.el('block', {var: this.args[0].value});
        };

        SPECIAL_CASE_BLOCKS['data_listcontents'] = () => {
            return xml.el('block', {s: 'reportJoinWords'},
                xml.el('block', {var: variables.getListName(this.args[0].value)}),
            );
        };

        SPECIAL_CASE_BLOCKS['argument_reporter_string_number'] =
        SPECIAL_CASE_BLOCKS['argument_reporter_boolean'] = () => {
            return xml.el('block', {var: variables.getParamName(this.args[0].value)});
        };

        SPECIAL_CASE_BLOCKS['procedures_call'] = () => {
            return xml.el(
                'custom-block',
                {
                    s: this.spec,
                    scope: scriptable.name,
                },
                this.args.map(argToXML),
            );
        };

        SPECIAL_CASE_BLOCKS['looks_goforwardbackwardlayers'] = () => {
            if (this.args[0].value === 'forward') {
                return xml.el('block', {s: 'goBack'}, [
                    xml.el('block', {s: 'reportDifference'}, [
                        xml.el('l', null, 0),
                        argToXML(this.args[1]),
                    ]),
                ]);
            }
            return xml.el('block', {s: 'goBack'}, [
                argToXML(this.args[1]),
            ]);
        };

        SPECIAL_CASE_BLOCKS['costumeName'] = () => {
            return xml.el('block', {s: 'reportAttributeOf'}, [
                xml.el('l', null, [
                    xml.el('option', null, 'costume name'),
                ]),
                xml.el('block', {s: 'reportObject'}, [
                    xml.el('l', null, [
                        xml.el('option', null, 'myself'),
                    ]),
                ]),
            ]);
        };

        SPECIAL_CASE_BLOCKS['looks_costumenumbername'] = () => {
            const arg = this.args[0].value;
            if (arg === 'number') {
                return xml.el('block', {s: 'getCostumeIdx'});
            }
            return SPECIAL_CASE_BLOCKS['costumeName']();
        };

        SPECIAL_CASE_BLOCKS['looks_switchbackdropto'] = () => {
            let result: Element;
            if (this.args[0] instanceof Primitive) {
                const backdrop = this.args[0].value;
                if (backdrop === 'next backdrop') {
                    result = xml.el('block', {s: 'doWearNextCostume'});
                } else if (backdrop === 'previous backdrop') {
                    result = xml.el('block', {s: 'doSwitchToCostume'}, [
                        xml.el('block', {s: 'reportDifference'}, [
                            xml.el('l', null, 0),
                            xml.el('l', null, 1),
                        ]),
                    ]);
                } else if (backdrop === 'random backdrop') {
                    result = xml.el('block', {s: 'doSwitchToCostume'}, [
                        xml.el('block', {s: 'reportListItem'}, [
                            xml.el('l', null, [
                                xml.el('option', null, 'any'),
                            ]),
                            xml.el('block', {s: 'reportGet'}, [
                                xml.el('l', null, [
                                    xml.el('option', null, 'costumes'),
                                ]),
                            ]),
                        ]),
                    ]);
                }
            }
            if (!result) {
                result = xml.el('block', {s: 'doSwitchToCostume'}, [
                    argToXML(this.args[0]),
                ]);
            }
            if (!(scriptable instanceof Stage)) {
                result = tellStageTo(result);
            }
            return result;
        };

        SPECIAL_CASE_BLOCKS['looks_nextbackdrop'] = () => {
            let result = xml.el('block', {s: 'doWearNextCostume'});
            if (!(scriptable instanceof Stage)) {
                result = tellStageTo(result);
            }
            return result;
        };

        SPECIAL_CASE_BLOCKS['backgroundIndex'] = () => {
            if (scriptable instanceof Stage) {
                return xml.el('block', {s: 'getCostumeIdx'});
            }
            return xml.el('block', {s: 'reportAttributeOf'}, [
                xml.el('l', null, [
                    xml.el('option', null, 'costume #'),
                ]),
                xml.el('l', null, 'Stage'),
            ]);
        };

        SPECIAL_CASE_BLOCKS['sceneName'] = () => {
            return xml.el('block', {s: 'reportAttributeOf'}, [
                xml.el('l', null, [
                    xml.el('option', null, 'costume name'),
                ]),
                xml.el('l', null, 'Stage'),
            ]);
        };

        SPECIAL_CASE_BLOCKS['looks_backdropnumbername'] = () => {
            const arg = this.args[0].value;
            if (arg === 'number' && scriptable instanceof Stage) {
                return xml.el('block', {s: 'getCostumeIdx'});
            }
            const newArg = arg === 'number' ? 'costume #' : 'costume name';
            return xml.el('block', {s: 'reportAttributeOf'}, [
                xml.el('l', null,
                    xml.el('option', null, newArg),
                ),
                xml.el('l', null, 'Stage'),
            ]);
        };

        SPECIAL_CASE_BLOCKS['event_whenthisspriteclicked'] = () => {
            return xml.el('block', {s: 'receiveInteraction'}, [
                xml.el('l', null, [
                    xml.el('option', null, 'pressed'),
                ]),
            ]);
        };

        SPECIAL_CASE_BLOCKS['videoSensing_videoToggle'] = () => {
            const arg = this.args[0].value;
            if (arg === 'off') {
                return xml.el('block', {s: 'doSetGlobalFlag'}, [
                    xml.el('l', null, [
                        xml.el('option', null, 'video capture'),
                    ]),
                    xml.el('l', null, [
                        xml.el('bool', null, false),
                    ]),
                ]);
            }
            const mirror = arg === 'on';
            return xml.docFragment([
                xml.el('block', {s: 'doSetGlobalFlag'}, [
                    xml.el('l', null, [
                        xml.el('option', null, 'video capture'),
                    ]),
                    xml.el('l', null, [
                        xml.el('bool', null, true),
                    ]),
                ]),
                xml.el('block', {s: 'doSetGlobalFlag'}, [
                    xml.el('l', null, [
                        xml.el('option', null, 'mirror video'),
                    ]),
                    xml.el('l', null, [
                        xml.el('bool', null, mirror),
                    ]),
                ]),
            ]);
        };

        SPECIAL_CASE_BLOCKS['operator_join'] = () => {
            return xml.el('block', {s: 'reportJoinWords'}, [
                xml.el('list', null, [
                    argToXML(this.args[0]),
                    argToXML(this.args[1]),
                ]),
            ]);
        };

        SPECIAL_CASE_BLOCKS['pen_changePenHueBy'] = () => {
            return xml.el('block', {s: 'changePenHSVA'}, [
                xml.el('l', null, [
                    xml.el('option', null, 'hue'),
                ]),
                argToXML(this.args[0]),
            ]);
        };

        SPECIAL_CASE_BLOCKS['pen_setPenHueToNumber'] = () => {
            return xml.el('block', {s: 'setPenHSVA'}, [
                xml.el('l', null, [
                    xml.el('option', null, 'hue'),
                ]),
                argToXML(this.args[0]),
            ]);
        };

        SPECIAL_CASE_BLOCKS['pen_changePenShadeBy'] = () => {
            return xml.el('block', {s: 'changePenHSVA'}, [
                xml.el('l', null, [
                    xml.el('option', null, 'brightness'),
                ]),
                argToXML(this.args[0]),
            ]);
        };

        SPECIAL_CASE_BLOCKS['pen_setPenShadeToNumber'] = () => {
            return xml.el('block', {s: 'setPenHSVA'}, [
                xml.el('l', null, [
                    xml.el('option', null, 'brightness'),
                ]),
                argToXML(this.args[0]),
            ]);
        };

        let element: Element;
        if (SPECIAL_CASE_BLOCKS.hasOwnProperty(this.op)) {
            element = SPECIAL_CASE_BLOCKS[this.op]();
        } else {
            const snapOp = SB3_TO_SNAP_OP_MAP[this.op] || this.op;
            if (!snapOp) {
                throw new Error('Unsupported block: ' + this.op);
            }
            element = xml.el('block', {s: snapOp}, this.args.map(argToXML));
        }
        if (this.comment) {
            element.appendChild(this.comment.toXML(xml));
        }
        return element;
    }
}
