import XMLDoc from '../XMLDoc';

export default class Variable {
    name: string;
    value: any;

    constructor(name: string, value?: any) {
        this.name = name;
        if (value != null) {
            this.value = value;
        }
    }

    toXML(xml: XMLDoc): Element {
        return xml.el('variable', {
            name: this.name,
        }, [
            this.value.toXML(xml),
        ]);
    }
}
