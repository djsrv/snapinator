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

import { SB2_TO_SB3_OP_MAP } from '../data/SB2Data';
import {
    OBJECT_NAMES,
    SB3_ARG_MAPS,
    SB3_CONSTANTS,
    SB3_TO_SNAP_OP_MAP,
    SB3_VAR_TYPES,
} from '../data/SB3Data';
import { h } from '../xml';
import BlockDefinition from './BlockDefinition';
import Color from './Color';
import Primitive from './Primitive';
import Script from './Script';
import Scriptable from './Scriptable';
import ScriptComment from './ScriptComment';
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

    static forList(varName: string) {
        return new Block().initForList(varName);
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

    initForList(listName: string) {
        this.op = 'data_listcontents';
        this.args = [Block.forVar(listName)];
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
        const id = jsonArr[2];
        if (type === SB3_CONSTANTS.VAR_PRIMITIVE) {
            return this.initForVar(variables.getVarName(id));
        }
        if (type === SB3_CONSTANTS.LIST_PRIMITIVE) {
            return this.initForList(variables.getListName(id));
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
    ): any {
        let value: any;
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
                return Block.forVar(variables.getListName(argArr[1]));
            } else if (argSpec.variableType === SB3_VAR_TYPES.VAR_SCALAR_TYPE) {
                value = variables.getVarName(argArr[1]);
            } else {
                value = argArr[0];
            }
        }
        let prim: Primitive;
        if (typeof value === 'string' && argSpec.snapOptionInput) {
            prim = new Primitive(value, true);
        } else {
            prim = new Primitive(value);
        }
        if (SPECIAL_CASE_ARGS[this.op] && SPECIAL_CASE_ARGS[this.op][argIndex]) {
            prim = SPECIAL_CASE_ARGS[this.op][argIndex](prim);
        }
        return prim;
    }

    toXML(scriptable: Scriptable, variables: VariableFrame, isArg: boolean = false): Element {
        const argToXML = (arg: any) => {
            if (arg instanceof Script) {
                const script: Script = arg;
                return script.toXML(scriptable, variables);
            }
            if (arg instanceof Block) {
                const block: Block = arg;
                return block.toXML(scriptable, variables, true);
            }
            return arg.toXML();
        };

        const tellStageTo = (block: any) => {
            return <block s="doTellTo">
                <l>Stage</l>
                <block s="reifyScript">
                    <script>{block}</script>
                    <list/>
                </block>
                <list/>
            </block>;
        };

        const SPECIAL_CASE_BLOCKS: any = {};

        SPECIAL_CASE_BLOCKS['data_variable'] = () => {
            return <block var={this.args[0].value}/>;
        };

        SPECIAL_CASE_BLOCKS['data_listcontents'] = () => {
            return <block s="reportJoinWords">
                {argToXML(this.args[0])}
            </block>;
        };

        SPECIAL_CASE_BLOCKS['argument_reporter_string_number'] =
        SPECIAL_CASE_BLOCKS['argument_reporter_boolean'] = () => {
            return <block var={variables.getParamName(this.args[0].value)}/>;
        };

        SPECIAL_CASE_BLOCKS['procedures_call'] = () => {
            return <custom-block s={this.spec} scope={scriptable.name}>
                {this.args.map(argToXML)}
            </custom-block>;
        };

        SPECIAL_CASE_BLOCKS['motion_glideto'] = () => {
            const component = (objName, x) => {
                if (objName.value === '_mouse_') {
                    return <block s={x ? 'reportMouseX' : 'reportMouseY'}/>;
                }
                if (objName.value === '_random_') {
                    return <block s="reportRandom">
                        <block s="reportAttributeOf">
                            <l><option>{x ? 'left' : 'bottom'}</option></l>
                            <l>Stage</l>
                        </block>
                        <block s="reportAttributeOf">
                            <l><option>{x ? 'right' : 'top'}</option></l>
                            <l>Stage</l>
                        </block>
                    </block>;
                }
                return <block s="reportAttributeOf">
                    <l><option>{x ? 'x position' : 'y position'}</option></l>
                    {argToXML(objName)}
                </block>;
            };

            return <block s="doGlide">{[
                argToXML(this.args[0]),
                component(this.args[1], true),
                component(this.args[1], false),
            ]}</block>;
        };

        SPECIAL_CASE_BLOCKS['motion_setrotationstyle'] = () => {
            const ROTATION_STYLES = {
                'don\'t rotate': 0,
                'all around': 1,
                'left-right': 2,
            };
            return <block s="doSetVar">
                <l><option>rotation style</option></l>
                <l>{ROTATION_STYLES[this.args[0].value] || 0}</l>
            </block>
        };

        SPECIAL_CASE_BLOCKS['comeToFront'] = () => {
            return <block s="goToLayer">
                <l><option>front</option></l>
            </block>;
        };

        SPECIAL_CASE_BLOCKS['looks_goforwardbackwardlayers'] = () => {
            if (this.args[0].value === 'forward') {
                if (this.args[1] instanceof Block) {
                    return <block s="goBack">
                        <block s="reportDifference">
                            <l>0</l>
                            {argToXML(this.args[1])}
                        </block>
                    </block>;
                } else {
                    this.args[1].value = -this.args[1].value;
                }
            }
            return <block s="goBack">{argToXML(this.args[1])}</block>;
        };

        SPECIAL_CASE_BLOCKS['costumeName'] = () => {
            return <block s="reportAttributeOf">
                <l><option>costume name</option></l>
                <block s="reportObject">
                    <l><option>myself</option></l>
                </block>
            </block>;
        };

        SPECIAL_CASE_BLOCKS['looks_costumenumbername'] = () => {
            const arg = this.args[0].value;
            if (arg === 'number') {
                return <block s="getCostumeIdx"/>
            }
            return SPECIAL_CASE_BLOCKS['costumeName']();
        };

        SPECIAL_CASE_BLOCKS['looks_switchbackdropto'] = () => {
            let result: Element;
            if (this.args[0] instanceof Primitive) {
                const backdrop = this.args[0].value;
                if (backdrop === 'next backdrop') {
                    result = <block s="doWearNextCostume"/>;
                } else if (backdrop === 'previous backdrop') {
                    result = <block s="doSwitchToCostume">
                        <block s="reportDifference">
                            <l>0</l>
                            <l>1</l>
                        </block>
                    </block>;
                } else if (backdrop === 'random backdrop') {
                    result = <block s="doSwitchToCostume">
                        <block s="reportListItem">
                            <l><option>any</option></l>
                            <block s="reportGet">
                                <l><option>costumes</option></l>
                            </block>
                        </block>
                    </block>;
                }
            }
            if (!result) {
                result = <block s="doSwitchToCostume">
                    {argToXML(this.args[0])}
                </block>;
            }
            if (!scriptable.isStage) {
                result = tellStageTo(result);
            }
            return result;
        };

        SPECIAL_CASE_BLOCKS['looks_nextbackdrop'] = () => {
            let result = <block s="doWearNextCostume"/>;
            if (!scriptable.isStage) {
                result = tellStageTo(result);
            }
            return result;
        };

        SPECIAL_CASE_BLOCKS['backgroundIndex'] = () => {
            if (scriptable.isStage) {
                return <block s="getCostumeIdx"/>;
            }
            return <block s="reportAttributeOf">
                <l><option>costume #</option></l>
                <l>Stage</l>
            </block>;
        };

        SPECIAL_CASE_BLOCKS['sceneName'] = () => {
            return <block s="reportAttributeOf">
                <l><option>costume name</option></l>
                <l>Stage</l>
            </block>;
        };

        SPECIAL_CASE_BLOCKS['looks_backdropnumbername'] = () => {
            const arg = this.args[0].value;
            if (arg === 'number' && scriptable.isStage) {
                return <block s="getCostumeIdx"/>;
            }
            const newArg = arg === 'number' ? 'costume #' : 'costume name';
            return <block s="reportAttributeOf">
                <l><option>{newArg}</option></l>
                <l>Stage</l>
            </block>;
        };

        SPECIAL_CASE_BLOCKS['event_whenthisspriteclicked'] = () => {
            return <block s="receiveInteraction">
                <l><option>pressed</option></l>
            </block>;
        };

        SPECIAL_CASE_BLOCKS['sensing_touchingobject'] = () => {
            return <block s="reportAnd">
                <block s="reportShown"/>
                <block s="reportTouchingObject">
                    {argToXML(this.args[0])}
                </block>
            </block>;
        };

        SPECIAL_CASE_BLOCKS['videoSensing_videoToggle'] = () => {
            const arg = this.args[0].value;
            if (arg === 'off') {
                return <block s="doSetGlobalFlag">
                    <l><option>video capture</option></l>
                    <l><bool>false</bool></l>
                </block>;
            }
            const mirror = arg === 'on';
            return [
                <block s="doSetGlobalFlag">
                    <l><option>video capture</option></l>
                    <l><bool>true</bool></l>
                </block>,
                <block s="doSetGlobalFlag">
                    <l><option>mirror video</option></l>
                    <l><bool>{mirror}</bool></l>
                </block>,
            ];
        };

        SPECIAL_CASE_BLOCKS['operator_join'] = () => {
            return <block s="reportJoinWords">
                <list>
                    {argToXML(this.args[0])}
                    {argToXML(this.args[1])}
                </list>
            </block>;
        };

        SPECIAL_CASE_BLOCKS['pen_changePenHueBy'] = () => {
            return <block s="changePenHSVA">
                <l><option>hue</option></l>
                {argToXML(this.args[0])}
            </block>;
        };

        SPECIAL_CASE_BLOCKS['pen_setPenHueToNumber'] = () => {
            return <block s="setPenHSVA">
                <l><option>hue</option></l>
                {argToXML(this.args[0])}
            </block>;
        };

        SPECIAL_CASE_BLOCKS['pen_changePenShadeBy'] = () => {
            return <block s="changePenHSVA">
                <l><option>brightness</option></l>
                {argToXML(this.args[0])}
            </block>;
        };

        SPECIAL_CASE_BLOCKS['pen_setPenShadeToNumber'] = () => {
            return <block s="setPenHSVA">
                <l><option>brightness</option></l>
                {argToXML(this.args[0])}
            </block>;
        };

        SPECIAL_CASE_BLOCKS['data_deletealloflist'] = () => {
            return <block s="doDeleteFromList">
                <l><option>all</option></l>
                {argToXML(this.args[0])}
            </block>;
        };

        let element: Element;
        if (SPECIAL_CASE_BLOCKS.hasOwnProperty(this.op)) {
            element = SPECIAL_CASE_BLOCKS[this.op]();
        } else {
            const snapOp = SB3_TO_SNAP_OP_MAP[this.op];
            if (snapOp) {
                element = <block s={snapOp}>{this.args.map(argToXML)}</block>;
            } else {
                element = scriptable.project.unsupportedBlock(this.op, isArg);
            }
        }
        if (this.comment) {
            element.appendChild(this.comment.toXML());
        }
        return element;
    }
}
