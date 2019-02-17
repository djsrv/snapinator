import ImageFile from '../media/ImageFile';
import Scriptable from './Scriptable';
import Sprite from './Sprite';
import Watcher from './Watcher';

export default class Stage extends Scriptable {
    tempo: number;
    children: Array<Sprite | Watcher>;
}
