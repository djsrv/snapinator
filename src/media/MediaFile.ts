export default class MediaFile {
    dataFormat: string;
    data: Uint8Array;

    constructor(dataFormat, data) {
        this.dataFormat = dataFormat;
        this.data = data;
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
        let dataString = '';
        for (let i = 0, l = this.data.length; i < l; i++) {
            dataString += String.fromCharCode(this.data[i]);
        }
        return 'data:' + mimeTypes[this.dataFormat] + ';base64,' + btoa(dataString);
    }
}
