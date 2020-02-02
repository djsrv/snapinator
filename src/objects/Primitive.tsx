import { h } from '../xml';

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

    toXML(): Element {
        if (this.isOption) {
            return <l><option>{this.value}</option></l>;
        }
        if (typeof this.value === 'boolean') {
            if (this.value) {
                return <l><bool>true</bool></l>;
            }
            return <l/>;
        }
        if (this.value == null) {
            return <l/>;
        }
        return <l>{this.value}</l>;
    }
}
