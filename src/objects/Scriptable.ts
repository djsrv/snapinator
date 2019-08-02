import Project from '../Project';
import XMLDoc from '../XMLDoc';
import BlockDefinition from './BlockDefinition';
import Costume from './Costume';
import Script from './Script';
import ScriptComment from './ScriptComment';
import Sound from './Sound';
import VariableFrame from './VariableFrame';

export default class Scriptable {
    name: string;
    costumes: Costume[];
    sounds: Sound[];
    costumeIndex: number;
    variables: VariableFrame;
    blocks: BlockDefinition[];
    scripts: Array<Script | ScriptComment>;

    readSB2(jsonObj: any, project: Project): Scriptable {
        const costumeObjs = jsonObj.costumes;
        const soundObjs = jsonObj.sounds;
        const commentObjs = jsonObj.scriptComments;
        const scriptObjs = jsonObj.scripts;

        const blockComments = [];
        let nextBlockID = 0;

        this.name = jsonObj.objName;
        this.costumes = [];
        if (costumeObjs != null) {
            for (const costumeObj of costumeObjs) {
                this.costumes.push(new Costume().readSB2(costumeObj, project));
            }
        }
        this.sounds = [];
        if (soundObjs != null) {
            for (const soundObj of soundObjs) {
                this.sounds.push(new Sound().readSB2(soundObj, project));
            }
        }
        this.costumeIndex = jsonObj.currentCostumeIndex + 1;
        this.blocks = [];
        this.scripts = [];
        if (commentObjs != null) {
            for (const commentObj of commentObjs) {
                const blockID = commentObj[5];
                const comment = new ScriptComment().readSB2(commentObj);
                if (blockID === -1) {
                    this.scripts.push(comment);
                } else {
                    blockComments[blockID] = comment;
                }
            }
        }
        console.log(blockComments);
        if (scriptObjs != null) {
            for (const scriptObj of scriptObjs) {
                const blockStackObj = scriptObj[2];
                const firstBlockObj = blockStackObj[0];
                const firstOp = firstBlockObj[0];
                if (firstOp === 'procDef') {
                    // let blockDef;
                    // [blockDef, nextBlockID] = new BlockDefinition().readSB2(
                    //     scriptObj, nextBlockID, blockComments, this.variables,
                    // );
                    // this.blocks.push(blockDef);
                } else {
                    let script;
                    [script, nextBlockID] = new Script().readSB2(scriptObj, nextBlockID, blockComments);
                    this.scripts.push(script);
                }
            }
        }

        return this;
    }

    costumesXML(xml: XMLDoc) {
        return xml.el('costumes', null, [
            xml.el('list', null, this.costumes.map(
                (costume) => xml.el('item', null, [costume.toXML(xml)]),
            )),
        ]);
    }

    soundsXML(xml: XMLDoc): Element {
        return xml.el('sounds', null, [
            xml.el('list'),
        ]);
    }

    blocksXML(xml: XMLDoc): Element {
        return xml.el('blocks');
    }

    scriptsXML(xml: XMLDoc): Element {
        return xml.el('scripts', null, this.scripts.map((scriptOrComment) => {
            if (scriptOrComment instanceof ScriptComment) {
                const comment: ScriptComment = scriptOrComment;
                return comment.toXML(xml);
            }
            const script: Script = scriptOrComment;
            return script.toXML(xml, this, this.variables);
        }));
    }
}
