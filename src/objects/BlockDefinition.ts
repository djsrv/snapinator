import Script from './Script';
import ScriptComment from './ScriptComment';
import VariableFrame from './VariableFrame';

export default class BlockDefinition {
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
        variables: VariableFrame,
    ): [BlockDefinition, number] {
        return [this, nextBlockID];
    }
}
