export function h(tagName: string, attribs?: any, ...content: any): Element {
    const el = document.createElementNS(null, tagName);
    const addContent = (c: any) => {
        if (c == null) {
            return;
        }
        if (Array.isArray(c)) {
            for (const child of c) {
                addContent(child);
            }
        } else {
            el.appendChild(c instanceof Node ? c : new Text(c));
        }
    };
    if (attribs) {
        for (const key in attribs) {
            if (attribs.hasOwnProperty(key)) {
                el.setAttribute(key, attribs[key]);
            }
        }
    }
    addContent(content);
    return el;
}

export function serializeXML(el: Element): string {
    return new XMLSerializer().serializeToString(el);
}
