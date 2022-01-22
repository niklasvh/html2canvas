import { Context } from '../core/context';
import { RenderConfigurations } from './canvas/canvas-renderer';
export declare class Renderer {
    protected readonly context: Context;
    protected readonly options: RenderConfigurations;
    constructor(context: Context, options: RenderConfigurations);
}
