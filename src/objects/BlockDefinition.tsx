import { h } from '../xml';
import Script from './Script';
import Scriptable from './Scriptable';
import ScriptComment from './ScriptComment';
import VariableFrame from './VariableFrame';

export default class BlockDefinition {
    static convertSemanticSpec(spec: string): string {
        const ARG_TYPES = ['b', 'n', 's'];

        const convertPart = (part) => {
            if (part.charAt(0) === '%') { // argument
                if (ARG_TYPES.includes(part.slice(1))) {
                    return part;
                }
                throw new Error('Invalid custom block argument type: ' + part);
            }
            part = part.replace(/\\(.)/g, '$1'); // unescape
            if (part.charAt(0) === '%' && part.length > 1) {
                // prevent Snap! from turning this into an input
                return '\\' + part;
            }
            return part;
        };

        return spec.split(' ').map(convertPart).join(' ');
    }

    spec: string;
    type: string;
    inputTypes: string[];
    variables: VariableFrame;
    script: Script;
    warp: boolean;
    comment: ScriptComment;

    setSpec(semanticSpec: string) {
        let inputIndex = -1;
        this.inputTypes = [];
        const convertSpecPart = (part) => {
            if (part.charAt(0) === '%') {
                inputIndex += 1;
                this.inputTypes.push(part);
                return '%\'' + this.variables.vars[inputIndex].name + '\'';
            }
            return part;
        };
        this.spec = semanticSpec.split(' ').map(convertSpecPart).join(' ');
    }

    readSB2(
        jsonArr: any[],
        nextBlockID: number,
        blockComments: ScriptComment[],
        parentVariables: VariableFrame,
    ): [BlockDefinition, number] {
        const blockID = nextBlockID;
        const defArr = jsonArr[0];

        const semanticSpec = BlockDefinition.convertSemanticSpec(defArr[1]);
        this.warp = defArr[4];
        const paramNames = defArr[2];
        this.variables = new VariableFrame(parentVariables).readBlockParams(paramNames);
        this.setSpec(semanticSpec);
        this.type = 'command';

        nextBlockID += 1 + this.variables.vars.length;
        if (jsonArr.length > 1) {
            [this.script, nextBlockID] = new Script().readSB2(
                jsonArr.slice(1), nextBlockID, blockComments, this.variables, true,
            );
        }

        if (blockComments[blockID]) {
            this.comment = blockComments[blockID];
        }

        return [this, nextBlockID];
    }

    readSB3(
        defID: string,
        blockMap: any,
        blockComments: {[s: string]: ScriptComment},
        parentVariables: VariableFrame,
    ): BlockDefinition {
        const defObj = blockMap[defID];
        const protoID = defObj.inputs['custom_block'][1];
        const protoObj = blockMap[protoID];

        const semanticSpec = BlockDefinition.convertSemanticSpec(protoObj.mutation.proccode);
        // protoObj.mutation.warp is sometimes stored as a boolean and sometimes as a stringified boolean
        this.warp = protoObj.mutation.warp.toString() === 'true';
        const paramNames = JSON.parse(protoObj.mutation.argumentnames);
        this.variables = new VariableFrame(parentVariables).readBlockParams(paramNames);
        this.setSpec(semanticSpec);
        this.type = 'command';

        if (defObj.next) {
            this.script = new Script().readSB3(defObj.next, blockMap, blockComments, this.variables, true);
        }

        if (blockComments[defID]) {
            this.comment = blockComments[defID];
        }

        return this;
    }

    placeholder(spec: string, isReporter: boolean): BlockDefinition {
        this.setSpec(spec);
        this.type = isReporter ? 'reporter' : 'command';
        this.inputTypes = [];
        this.variables = new VariableFrame();
        this.warp = false;
        return this;
    }

    toXML(scriptable: Scriptable) {
        const children = [
            <header/>,
            <code/>,
            <inputs>
                {this.inputTypes.map((type) => <input type={type}/>)}
            </inputs>,
        ];
        if (this.comment) {
            children.push(this.comment.toXML());
        }
        if (this.warp) {
            children.push(
                <script>
                    <block s="doWarp">
                        {this.script
                                ? this.script.toXML(scriptable, this.variables)
                                : <script/>}
                    </block>
                </script>
            );
        } else if (this.script) {
            children.push(this.script.toXML(scriptable, this.variables));
        }
        return <block-definition s={this.spec} type={this.type} category="other">
            {children}
        </block-definition>;
    }
}
