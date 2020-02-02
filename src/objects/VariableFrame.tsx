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

import { h } from '../xml';
import List from './List';
import Primitive from './Primitive';
import Variable from './Variable';

export default class VariableFrame {
    parent: VariableFrame;
    vars: Variable[];
    listNameMap: {[name: string]: string};
    paramNameMap: {[name: string]: string};

    constructor(parent?: VariableFrame) {
        this.parent = parent;
        this.vars = [];
        this.listNameMap = {};
        this.paramNameMap = {};
    }

    isNameUsed(name: string): boolean {
        for (const variable of this.vars) {
            if (variable.name === name) {
                return true;
            }
        }
        if (this.parent) {
            return this.parent.isNameUsed(name);
        }
        return false;
    }

    getUnusedName(name: string): string {
        if (!this.isNameUsed(name)) {
            return name;
        }

        const numIndex = name.search(/\d+$/);
        let prefix;
        let num;
        if (numIndex > -1) {
            prefix = name.substring(0, numIndex - 1);
            num = +name.substring(numIndex);
        } else {
            prefix = name;
            num = 1;
        }
        while (this.isNameUsed(name)) {
            num += 1;
            name = prefix + num;
        }
        return name;
    }

    getListName(oldName: string): string {
        if (this.listNameMap[oldName]) {
            return this.listNameMap[oldName];
        }
        if (this.parent) {
            return this.parent.getListName(oldName);
        }
        return null;
    }

    getParamName(oldName: string): string {
        if (this.paramNameMap[oldName]) {
            return this.paramNameMap[oldName];
        }
        if (this.parent) {
            return this.parent.getParamName(oldName);
        }
        return null;
    }

    readScriptableSB2(jsonObj: any): VariableFrame {
        const varObjs = jsonObj.variables;
        const listObjs = jsonObj.lists;

        if (varObjs != null) {
            for (const varObj of varObjs) {
                this.vars.push(new Variable(varObj.name, new Primitive(varObj.value)));
            }
        }
        if (listObjs != null) {
            for (const listObj of listObjs) {
                const oldName = listObj.listName;
                const newName = this.getUnusedName(oldName);
                this.vars.push(new Variable(newName, new List(listObj.contents)));
                this.listNameMap[oldName] = newName;
            }
        }

        return this;
    }

    readScriptableSB3(jsonObj: any): VariableFrame {
        const varDict = jsonObj.variables;
        const listDict = jsonObj.lists;

        for (const varID in varDict) {
            if (varDict.hasOwnProperty(varID)) {
                const varArr = varDict[varID];
                this.vars.push(new Variable(varArr[0], new Primitive(varArr[1])));
            }
        }

        for (const listID in listDict) {
            if (listDict.hasOwnProperty(listID)) {
                const listArr = listDict[listID];
                const oldName = listArr[0];
                const newName = this.getUnusedName(oldName);
                this.vars.push(new Variable(newName, new List(listArr[1])));
                this.listNameMap[oldName] = newName;
            }
        }

        return this;
    }

    readBlockParams(paramNames: string[]): VariableFrame {
        for (const oldName of paramNames) {
            const newName = this.getUnusedName(oldName.replace(/'/g, ''));
            this.vars.push(new Variable(newName));
            this.paramNameMap[oldName] = newName;
        }

        return this;
    }

    toXML(): Element {
        return <variables>
            {this.vars.map((variable) => variable.toXML())}
        </variables>;
    }
}
