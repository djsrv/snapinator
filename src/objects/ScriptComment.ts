import XMLDoc from '../XMLDoc';

export default class ScriptComment {
    x?: number;
    y?: number;
    text: string;
    width: number;
    collapsed: boolean;

    readSB2(jsonArr: any[]): ScriptComment {
        const blockID = jsonArr[5];
        if (blockID === -1) {
            this.x = jsonArr[0];
            this.y = jsonArr[1];
        }
        this.text = jsonArr[6];
        this.width = jsonArr[2];
        this.collapsed = !jsonArr[4];

        return this;
    }

    toXML(xml: XMLDoc) {
        const props: any = {
            w: this.width,
            collapsed: this.collapsed,
        };
        if (this.x != null && this.y != null) {
            props.x = this.x;
            props.y = this.y;
        }
        return xml.el('comment', props, this.text);
    }
}
