import XMLDoc from '../XMLDoc';
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

    getUnusedName(name: string) {
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

    readBlockDefSB2(jsonArr: any): VariableFrame {
        const paramNames = jsonArr[2];

        for (const oldName of paramNames) {
            const newName = this.getUnusedName(oldName.replace(/'/g, ''));
            this.vars.push(new Variable(newName));
            this.paramNameMap[oldName] = newName;
        }

        return this;
    }

    toXML(xml: XMLDoc): Element {
        return xml.el('variables', null, this.vars.map((variable) => variable.toXML(xml)));
    }
}
