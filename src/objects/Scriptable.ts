import Costume from './Costume';
import Script from './Script';
import Sound from './Sound';
import Variable from './Variable';

export default class Scriptable {
    name: string;
    variables: Variable[];
    scripts: Script[];
    sounds: Sound[];
    costumes: Costume[];
    costumeIndex: number;
}
