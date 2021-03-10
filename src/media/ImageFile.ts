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
import MediaFile from './MediaFile';
import * as Base64 from 'base64-js';
import loadSvgString from 'scratch-svg-renderer/src/load-svg-string';

export default class ImageFile extends MediaFile {
    async load(zip: Archive, assetID: string, dataFormat: string, log: (msg: any) => void, scratchVersion: number, resolution: number): Promise<ImageFile> {
        this.dataFormat = dataFormat;
        const fileName = assetID + '.' + dataFormat;
        const file = zip.file(fileName);
        if (!file) {
            throw new Error(`${fileName} does not exist`);
        }
        if (dataFormat === 'svg') {
            let svgString = await file.text();
            this.data = Base64.fromByteArray(
                new TextEncoder().encode(
                    this.fixSVG(svgString, scratchVersion)
                )
            );
        } else {
            await super.load(zip, assetID, dataFormat, log);
            if (resolution !== 1) {
                await this.fixResolution(resolution);
            }
        }
        return this;
    }

    fixSVG(svgString: string, scratchVersion: number): string {
        const svgTag = loadSvgString(svgString, scratchVersion === 2);
        return new XMLSerializer().serializeToString(svgTag);
    }

    async fixResolution(resolution: number): Promise<void> {
        return new Promise((resolve) => {
            if (resolution === 1) {
                resolve();
            }
            const img: HTMLImageElement = document.createElement('img');
            img.onload = () => {
                const canvas: HTMLCanvasElement = document.createElement('canvas');
                const ctx: CanvasRenderingContext2D = canvas.getContext('2d');
                ctx.imageSmoothingEnabled = false;
                canvas.width = img.width / resolution;
                canvas.height = img.height /resolution;
                ctx.drawImage(
                    img, 0, 0, img.width, img.height,
                    0, 0, img.width / resolution, img.height / resolution,
                );
                this.data = canvas.toDataURL();
                this.dataFormat = 'png';
                this.dataIsURL = true;
                resolve();
            };
            img.src = this.toDataURL();
        });
    }

    async addTextLayer(textLayer: ImageFile): Promise<ImageFile> {
        return new Promise((resolve) => {
            const baseImg: HTMLImageElement = document.createElement('img');
            baseImg.onload = () => {
                const textImg: HTMLImageElement = document.createElement('img');
                textImg.onload = () => {
                    const canvas: HTMLCanvasElement = document.createElement('canvas');
                    const ctx: CanvasRenderingContext2D = canvas.getContext('2d');
                    canvas.width = baseImg.width;
                    canvas.height = baseImg.height;
                    ctx.drawImage(baseImg, 0, 0);
                    ctx.drawImage(textImg, 0, 0);
                    const result: ImageFile = new ImageFile();
                    result.data = canvas.toDataURL();
                    result.dataFormat = 'png';
                    result.dataIsURL = true;
                    resolve(result);
                };
                textImg.src = textLayer.toDataURL();
            };
            baseImg.src = this.toDataURL();
        });
    }
}
