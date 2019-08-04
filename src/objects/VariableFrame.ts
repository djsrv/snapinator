import XMLDoc from '../XMLDoc';
import List from './List';
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

    varNameUsed(name: string): boolean {
        for (const variable of this.vars) {
            if (variable.name === name) {
                return true;
            }
        }
        if (this.parent) {
            return this.parent.varNameUsed(name);
        }
        return false;
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
        const variableObjs = jsonObj.variables;
        const listObjs = jsonObj.lists;

        if (variableObjs != null) {
            for (const varObj of variableObjs) {
                const variable = new Variable(varObj.name, varObj.value);
                this.vars.push(variable);
            }
        }
        if (listObjs != null) {
            for (const listObj of listObjs) {
                const oldName = listObj.listName;
                // TODO: Handle name edge cases
                const newName = '(list) ' + oldName;
                const variable = new Variable(newName, new List(listObj.contents));
                this.vars.push(variable);
                this.listNameMap[oldName] = newName;
            }
        }

        return this;
    }

    toXML(xml: XMLDoc): Element {
        return xml.el('variables', null, this.vars.map((variable) => variable.toXML(xml)));
    }
}
