import { h } from '../xml';

export default class List {
    contents: any[];

    constructor(contents: any[]) {
        this.contents = contents;
    }

    toXML(): Element {
        return <list struct="atomic">
            {this.contents.map(this.encodeCell).join(',')}
        </list>;
    }

    // Adapted from lists.js in Snap!
    encodeCell(atomicValue: any) {
        const str = atomicValue.toString();
        let cell: string[];
        if (str.indexOf('\"') ===  -1 &&
                (str.indexOf('\n') === -1) &&
                (str.indexOf('\,') === -1)) {
            return str;
        }
        cell = ['\"'];
        str.split('').forEach((letter) => {
            cell.push(letter);
            if (letter === '\"') {
                cell.push(letter);
            }
        });
        cell.push('\"');
        return cell.join('');
    }
}
