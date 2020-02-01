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
        let dataString;
        if (typeof this.data === 'string') {
            dataString = this.data;
        } else {
            dataString = '';
            for (let i = 0, l = this.data.length; i < l; i++) {
                dataString += String.fromCharCode(this.data[i]);
            }
        }
        return 'data:' + mimeTypes[this.dataFormat] + ';base64,' + btoa(dataString);
    }
}
