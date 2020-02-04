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

import { Base64 } from 'js-base64';

export default class MediaFile {
    dataFormat: string;
    data: Uint8Array | string;
    dataIsURL: boolean;

    constructor(dataFormat, data) {
        this.dataFormat = dataFormat;
        this.data = data;
        this.dataIsURL = false;
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
        return 'data:' + mimeTypes[this.dataFormat] + ';base64,' + Base64.encode(this.data);
    }
}
