import * as JSZip from 'jszip';
import Project from './Project';

/* Snapinator */

export default class Snapinator {
    static async readProject(file: ArrayBuffer): Promise<Project | Error> {
        const zip = await JSZip.loadAsync(file);
        const project = new Project();
        await project.readZip(zip);
        return project;
    }
}

/* Media */

export interface IProjectReader {
    readFile(file: ArrayBuffer): Promise<Project>;
}
