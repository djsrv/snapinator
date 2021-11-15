/*

    Snapinator
    Copyright (C) 2020  Deborah Servilla

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

import ImageFile from '../media/ImageFile';
import Project from '../Project';
import { h } from '../xml';

export default class Costume {
    name: string;
    file: ImageFile;
    rotationCenterX: number;
    rotationCenterY: number;

    readSB2(jsonObj: any, project: Project): Costume {
        this.name = jsonObj.costumeName;
        if (jsonObj.text != null) {
            this.file = project.media[jsonObj.baseLayerMD5 + '+' + jsonObj.textLayerMD5] as ImageFile;
        } else {
            this.file = project.media[jsonObj.baseLayerMD5] as ImageFile;
        }
        this.rotationCenterX = jsonObj.rotationCenterX / jsonObj.bitmapResolution;
        this.rotationCenterY = jsonObj.rotationCenterY / jsonObj.bitmapResolution;

        return this;
    }

    readSB3(jsonObj: any, project: Project): Costume {
        this.name = jsonObj.name;
        this.file = project.media[jsonObj.md5ext] as ImageFile;
        this.rotationCenterX = jsonObj.rotationCenterX / jsonObj.bitmapResolution;
        this.rotationCenterY = jsonObj.rotationCenterY / jsonObj.bitmapResolution;

        return this;
    }

    toXML(): Element {
        return <costume name={this.name} center-x={this.rotationCenterX} center-y={this.rotationCenterY} image={this.file.toDataURL()}/>;
    }
}
