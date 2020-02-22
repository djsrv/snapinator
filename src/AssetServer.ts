/*

    Snapinator
    Copyright (C) 2020  Dylan Servilla

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

export class AssetServerFile {
    fileName: string;

    constructor(fileName: string) {
        this.fileName = fileName;
    }

    async async(type: string): Promise<Uint8Array> {
        if (type !== 'uint8array') {
            throw new Error('AssetServerFile only supports uint8array');
        }
        const response = await fetch(`https://assets.scratch.mit.edu/internalapi/asset/${this.fileName}/get/`);
        return new Uint8Array(await response.arrayBuffer());
    }
}

export default class AssetServer {
    file(fileName) {
        return new AssetServerFile(fileName);
    }
}
