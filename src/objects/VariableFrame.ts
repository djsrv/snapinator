import List from './List';
import Variable from './Variable';

export default class VariableFrame {
    parent: VariableFrame;
    variables: {[name: string]: Variable};
    lists: {[name: string]: Variable};
    params: {[name: string]: Variable};

    constructor(parent?: VariableFrame) {
        this.parent = parent;
        this.variables = {};
        this.lists = {};
        this.params = {};
    }

    varNameUsed(name: string) {
        if (this.variables[name]) {
            return true;
        }
        if (this.parent) {
            return this.parent.varNameUsed(name);
        }
        return false;
    }

    varOrListNameUsed(name: string) {
        if (this.variables[name] || this.lists[name]) {
            return true;
        }
        if (this.parent) {
            return this.parent.varOrListNameUsed(name);
        }
        return false;
    }

    readScriptableSB2(jsonObj: any): VariableFrame {
        const variableObjs = jsonObj.variables;
        const listObjs = jsonObj.lists;

        if (variableObjs != null) {
            for (const varObj of variableObjs) {
                const variable: Variable = {
                    name: varObj.name,
                    value: varObj.value,
                };
                this.variables[varObj.name] = variable;
            }
        }
        if (listObjs != null) {
            for (const listObj of listObjs) {
                const oldName = listObj.listName;
                const newName = this.varNameUsed(oldName)
                                    ? oldName + ' (list)'
                                    : oldName;
                const variable: Variable = {
                    name: newName,
                    value: new List(listObj.contents),
                };
                this.lists[newName] = variable;
            }
        }

        return this;
    }
}
