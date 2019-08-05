import XMLDoc from '../XMLDoc';
import List from './List';

export default class Variable {
    name: string;
    value: any;

    constructor(name: string, value: any) {
        this.name = name;
        this.value = value;
    }

    toXML(xml: XMLDoc): Element {
        return xml.el('variable', {
            name: this.name,
        }, [
            this.value.toXML(xml),
        ]);
    }
}
