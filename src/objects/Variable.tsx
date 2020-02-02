import { h } from '../xml';

export default class Variable {
    name: string;
    value: any;

    constructor(name: string, value?: any) {
        this.name = name;
        if (value != null) {
            this.value = value;
        }
    }

    toXML(): Element {
        return <variable name={this.name}>
            {this.value.toXML()}
        </variable>;
    }
}
