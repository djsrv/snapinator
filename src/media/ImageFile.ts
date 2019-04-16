import MediaFile from './MediaFile';

export default class ImageFile extends MediaFile {
    resolution: number;

    constructor(dataFormat, data, resolution) {
        super(dataFormat, data);
        this.resolution = resolution;
    }

    // TODO: Resolution and SVG fixing
}
