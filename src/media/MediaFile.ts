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

import Archive from '../Archive';

export default class MediaFile {
    dataFormat: string;
    data: string;
    dataIsURL: boolean;

    constructor() {
        this.dataIsURL = false;
    }

    async load(zip: Archive, assetID: string, dataFormat: string, log: (msg: any) => void, scratchVersion?: number, resolution?: number): Promise<MediaFile> {
        this.dataFormat = dataFormat;
        const fileName = assetID + '.' + dataFormat;
        const file = zip.file(fileName);
        if (!file) {
            throw new Error(`${fileName} does not exist`);
        }
        this.data = await file.base64();
        return this;
    }

    toDataURL(): string {
        const mimeTypes = {
            gif: 'image/gif',
            jpg: 'image/jpeg',
            png: 'image/png',
            svg: 'image/svg+xml',
            wav: 'audio/x-wav',
            mp3: 'audio/mpeg',
        };
        if (this.dataIsURL) {
            return this.data as string;
        }
        return 'data:' + mimeTypes[this.dataFormat] + ';base64,' + this.data;
    }
}
