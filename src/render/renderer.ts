import {Context} from '../context';
import {RenderConfigurations} from './canvas/canvas-renderer';

export class Renderer {
    constructor(protected readonly context: Context, protected readonly options: RenderConfigurations) {}
}
