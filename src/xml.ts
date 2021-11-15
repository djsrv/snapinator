/*

    Snapinator
    Copyright (C) 2020  Deborah Servilla

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.

*/

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
