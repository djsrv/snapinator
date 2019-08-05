import XMLDoc from '../XMLDoc';

export default class Primitive {
    value: any;
    isOption: boolean;

    constructor(value: any, isOption = false) {
        this.value = value;
        this.isOption = isOption;
    }

    toString(): string {
        return this.value.toString();
    }

    toXML(xml: XMLDoc): Element {
        if (this.isOption) {
            return xml.el('l', null,
                xml.el('option', null, this.value),
            );
        }
        if (typeof this.value === 'boolean') {
            if (this.value) {
                return xml.el('l', null,
                    xml.el('bool', null, 'true'),
                );
            }
            return xml.el('l');
        }
        if (this.value == null) {
            return xml.el('l');
        }
        return xml.el('l', null, this.value);
    }
}
