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

import ADPCMSoundDecoder, { isADPCMData } from '../audio/ADPCMSoundDecoder';
import MediaFile from './MediaFile';
import * as Base64 from 'base64-js';
import * as WavEncoder from 'wav-encoder';

export default class SoundFile extends MediaFile {
    async load(zip: any, assetID: string, dataFormat: string, log: (msg: any) => void, scratchVersion?: number, resolution?: number): Promise<MediaFile> {
        const fileName = assetID + '.' + dataFormat;
        const file = zip.file(fileName);
        if (!file) {
            throw new Error(`${fileName} does not exist`);
        }
        let fileArray = await file.async('uint8array');
        if (isADPCMData(fileArray.buffer)) {
            log(`Decompressing ADPCM sound "${fileName}"`);
            const pcmBuffer = await WavEncoder.encode(
                await new ADPCMSoundDecoder(log).decode(fileArray.buffer)
            );
            fileArray = new Uint8Array(pcmBuffer);
        }
        this.data = Base64.fromByteArray(fileArray);
        this.dataFormat = dataFormat;
        return this;
    }
}
