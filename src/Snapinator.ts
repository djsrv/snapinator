import * as JSZip from 'jszip';
import Project from './Project';
import { SB1File } from 'scratch-sb1-converter';

/* Snapinator */

export default class Snapinator {
    static async readProject(file: ArrayBuffer): Promise<Project | Error> {
        let zip
        let jsonObj;
        try {
            zip = await JSZip.loadAsync(file);
            const jsonText = await zip.file('project.json').async('text');
            jsonObj = JSON.parse(jsonText);
        } catch (err) {
            const sb1 = new SB1File(file);
            jsonObj = sb1.json;
            zip = sb1.zip;
        }
        const project = new Project();
        await project.readProject(jsonObj, zip);
        return project;
    }
}
