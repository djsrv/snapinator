import XMLDoc from '../XMLDoc';
import Script from './Script';
import Scriptable from './Scriptable';
import ScriptComment from './ScriptComment';
import VariableFrame from './VariableFrame';

export default class BlockDefinition {
    static convertSpecSB2(spec: string): string {
        const ARG_TYPES = ['b', 'n', 's'];

        const convertPart = (part) => {
            if (part.charAt(0) === '%') { // argument
                if (ARG_TYPES.includes(part.slice(1))) {
                    return part;
                }
                throw new Error('Invalid custom block argument type: ' + part);
            }
            part = part.replace(/\\(.)/g, '$1'); // unescape
            if (part.charAt(0) === '%') {
                // prevent Snap! from turning this into an input
                return '\\' + part;
            }
            return part;
        };

        return spec.split(' ').map(convertPart).join(' ');
    }

    spec: string;
    inputTypes: string[];
    variables: VariableFrame;
    script: Script;
    warp: boolean;
    comment: ScriptComment;

    readSB2(
        jsonArr: any[],
        nextBlockID: number,
        blockComments: ScriptComment[],
        parentVariables: VariableFrame,
    ): [BlockDefinition, number] {
        const blockID = nextBlockID;

        const defArr = jsonArr[0];
        const semanticSpec = BlockDefinition.convertSpecSB2(defArr[1]);
        this.warp = defArr[4];

        this.variables = new VariableFrame(parentVariables).readBlockDefSB2(defArr);

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

    toXML(xml: XMLDoc, scriptable: Scriptable) {
        const children = [
            xml.el('header'),
            xml.el('code'),
            xml.el('inputs', null, this.inputTypes.map((type) => xml.el('input', {type}))),
        ];
        if (this.comment) {
            children.push(this.comment.toXML(xml));
        }
        if (this.warp) {
            children.push(
                xml.el('script', null,
                    xml.el('block', {s: 'doWarp'}, [
                        this.script
                            ? this.script.toXML(xml, scriptable, this.variables)
                            : xml.el('script'),
                    ]),
                ),
            );
        } else if (this.script) {
            children.push(this.script.toXML(xml, scriptable, this.variables));
        }
        return xml.el(
            'block-definition',
            {
                s: this.spec,
                type: 'command',
                category: 'other',
            },
            children,
        );
    }
}
