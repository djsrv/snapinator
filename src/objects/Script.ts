import XMLDoc from '../XMLDoc';
import Block from './Block';
import Scriptable from './Scriptable';
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
        embedded: boolean = false,
    ): [Script, number] {
        let blockObjs;
        if (embedded) {
            blockObjs = jsonArr;
        } else {
            this.x = jsonArr[0];
            this.y = jsonArr[1];
            blockObjs = jsonArr[2];
        }
        this.stack = [];
        console.log('START SCRIPT');
        for (const blockObj of blockObjs) {
            let block;
            [block, nextBlockID] = new Block().readSB2(blockObj, nextBlockID, blockComments);
            this.stack.push(block);
        }
        console.log('END SCRIPT');

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
