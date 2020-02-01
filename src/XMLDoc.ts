export default class XMLDoc {
    doc: Document;

    constructor() {
        this.doc = document.implementation.createDocument(null, null, null);
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
            if (!Array.isArray(content)) {
                content = [content];
            }
            for (const c of content) {
                el.appendChild(c instanceof Node ? c : new Text(c));
            }
        }
        return el;
    }

    docFragment(content: Node[]) {
        const fragment = this.doc.createDocumentFragment();
        for (const c of content) {
            fragment.appendChild(c);
        }
        return fragment;
    }

    serialize(): string {
        return new XMLSerializer().serializeToString(this.doc);
    }
}
