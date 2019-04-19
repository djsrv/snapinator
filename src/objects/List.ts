import XMLDoc from '../XMLDoc';

export default class List {
    contents: any[];

    constructor(contents: any[]) {
        this.contents = contents;
    }

    toXML(xml: XMLDoc): Element {
        return xml.el('list', {
            struct: 'atomic',
        }, [
            this.contents.map(this.encodeCell).join(','),
        ]);
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
