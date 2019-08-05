import XMLDoc from '../XMLDoc';
import Block from './Block';
import ScriptComment from './ScriptComment';
import VariableFrame from './VariableFrame';

export default class Script {
    x?: number;
    y?: number;
    stack: Block[];

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
        this.stack = [];
        for (const blockArr of blockArrs) {
            let block;
            [block, nextBlockID] = new Block().readSB2(blockArr, nextBlockID, blockComments, variables);
            this.stack.push(block);
        }

        return [this, nextBlockID];
    }

    toXML(xml: XMLDoc, forStage: boolean, variables: VariableFrame): Element {
        const props: any = {};
        if (this.x != null && this.y != null) {
            props.x = this.x;
            props.y = this.y;
        }
        return xml.el('script', props, this.stack.map((block) => block.toXML(xml, forStage, variables)));
    }
}
