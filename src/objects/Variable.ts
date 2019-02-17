import List from './List';

export default class Variable {
    static readVariablesSB2(jsonObj: any): Variable[] {
        const variables = jsonObj.variables;
        const lists = jsonObj.lists;
        const result: Variable[] = [];
        if (variables != null) {
            for (const varObj of variables) {
                const variable: Variable = {
                    type: VariableType.Any,
                    name: varObj.name,
                    value: varObj.value,
                    persistent: varObj.isPersistent,
                };
                result.push(variable);
            }
        }
        if (lists != null) {
            for (const listObj of lists) {
                const variable: Variable = {
                    type: VariableType.List,
                    name: listObj.listName,
                    value: new List(listObj.contents),
                    persistent: listObj.isPersistent,
                };
                result.push(variable);
            }
        }
        return result;
    }

    type: VariableType;
    name: string;
    value: any;
    persistent: boolean;
}

export enum VariableType {
    Any,
    List,
}
