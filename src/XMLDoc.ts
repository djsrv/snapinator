export default class XMLDoc {
    doc: Document;

    constructor() {
        this.doc = document.implementation.createDocument('', '', null);
    }

    el(tagName: string, attribs?: any, content?: any): Element {
        const el = this.doc.createElement(tagName);
        if (attribs) {
            for (const key in attribs) {
                if (attribs.hasOwnProperty(key)) {
                    el.setAttribute(key, attribs[key]);
                }
            }
        }
        if (content != null) {
            if (content.constructor !== Array) {
                content = [content];
            }
            for (const c of content) {
                el.appendChild(c instanceof Node ? c : new Text(c));
            }
        }
        return el;
    }

    serialize(): string {
        return new XMLSerializer().serializeToString(this.doc);
    }
}
