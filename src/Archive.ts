/*

    Snapinator
    Copyright (C) 2021  Dylan Servilla

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

import * as Base64 from 'base64-js';
import * as unzipit from 'unzipit';

export abstract class ArchiveEntry {
    abstract uint8array(): Promise<Uint8Array>;

    async base64(): Promise<string> {
        return Base64.fromByteArray(await this.uint8array());
    }

    async text(): Promise<string> {
        return new TextDecoder().decode(await this.uint8array());
    }
}

export default interface Archive {
    file(fileName: string): ArchiveEntry;
}

export class ZipEntry extends ArchiveEntry {
    file: unzipit.ZipEntry;

    constructor(file: unzipit.ZipEntry) {
        super();
        this.file = file;
    }

    async uint8array(): Promise<Uint8Array> {
        return new Uint8Array(await this.file.arrayBuffer());
    }
}

export class ZipArchive implements Archive {
    zip: unzipit.Zip;
    entries: {[key: string]: unzipit.ZipEntry};

    async load(buf: ArrayBuffer): Promise<ZipArchive> {
        const {zip, entries} = await unzipit.unzip(buf);
        this.zip = zip;
        this.entries = entries;
        return this;
    }

    file(fileName: string): ZipEntry {
        return new ZipEntry(this.entries[fileName]);
    }
}

export class SB1Entry extends ArchiveEntry {
    file: any;

    constructor(file: any) {
        super();
        this.file = file;
    }

    async uint8array(): Promise<Uint8Array> {
        return this.file.async('uint8array');
    }
}

export class SB1Archive implements Archive {
    zip: any;

    constructor(zip: any) {
        this.zip = zip;
    }

    file(fileName: string): SB1Entry {
        return new SB1Entry(this.zip.file(fileName));
    }
}

export class AssetServerEntry extends ArchiveEntry {
    fileName: string;

    constructor(fileName: string) {
        super();
        this.fileName = fileName;
    }

    async uint8array(): Promise<Uint8Array> {
        const response = await fetch(`https://assets.scratch.mit.edu/internalapi/asset/${this.fileName}/get/`);
        return new Uint8Array(await response.arrayBuffer());
    }
}

export class AssetServer implements Archive {
    file(fileName: string): AssetServerEntry {
        return new AssetServerEntry(fileName);
    }
}
