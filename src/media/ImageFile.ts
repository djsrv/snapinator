import MediaFile from './MediaFile';
import { SVGRenderer } from 'scratch-svg-renderer';

export default class ImageFile extends MediaFile {
    resolution: number;

    constructor(dataFormat, data, resolution) {
        super(dataFormat, data);
        this.resolution = resolution;
    }

    async fixData(scratchVersion: number) {
        if (this.dataFormat === 'svg') {
            this.fixSVG(scratchVersion);
        } else if (this.resolution !== 1) {
            await this.fixResolution();
        }
    }

    fixSVG(scratchVersion: number) {
        const renderer = new SVGRenderer();
        renderer.loadString(this.data, scratchVersion === 2);
        this.data = new XMLSerializer().serializeToString(renderer._svgTag);
    }

    async fixResolution(): Promise<null> {
        return new Promise((resolve) => {
            if (this.resolution === 1) {
                resolve();
            }
            const img: HTMLImageElement = document.createElement('img');
            img.onload = () => {
                const canvas: HTMLCanvasElement = document.createElement('canvas');
                const ctx: CanvasRenderingContext2D = canvas.getContext('2d');
                ctx.imageSmoothingEnabled = false;
                canvas.width = img.width / this.resolution;
                canvas.height = img.height / this.resolution;
                ctx.drawImage(
                    img, 0, 0, img.width, img.height,
                    0, 0, img.width / this.resolution, img.height / this.resolution,
                );
                this.data = canvas.toDataURL();
                this.dataFormat = 'png';
                this.dataIsURL = true;
                this.resolution = 1;
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
                    const result: ImageFile = new ImageFile('png', canvas.toDataURL(), this.resolution);
                    result.dataIsURL = true;
                    resolve(result);
                };
                textImg.src = textLayer.toDataURL();
            };
            baseImg.src = this.toDataURL();
        });
    }
}
