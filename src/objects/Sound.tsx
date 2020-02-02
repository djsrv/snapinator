import SoundFile from '../media/SoundFile';
import Project from '../Project';
import { h } from '../xml';

export default class Sound {
    name: string;
    file: SoundFile;

    readSB2(jsonObj: any, project: Project): Sound {
        this.name = jsonObj.soundName;
        this.file = project.media[jsonObj.md5] as SoundFile;

        return this;
    }

    readSB3(jsonObj: any, project: Project): Sound {
        this.name = jsonObj.name;
        this.file = project.media[jsonObj.md5ext] as SoundFile;

        return this;
    }

    toXML(): Element {
        return <sound name={this.name} sound={this.file.toDataURL()}/>;
    }
}
