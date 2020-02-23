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

export default class AudioData {
    sampleRate: number;
    channelData: Float32Array[];

    constructor(channels: number, length: number, sampleRate: number) {
        this.sampleRate = sampleRate;
        if (channels === 1) {
            this.channelData = [new Float32Array(length)];
        } else {
            this.channelData = [new Float32Array(length), new Float32Array(length)];
        }
    }
}
