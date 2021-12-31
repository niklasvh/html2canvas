import { RenderConfigurations } from './canvas-renderer';
import { Renderer } from '../renderer';
import { Context } from '../../core/context';
export declare class ForeignObjectRenderer extends Renderer {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    options: RenderConfigurations;
    constructor(context: Context, options: RenderConfigurations);
    render(element: HTMLElement): Promise<HTMLCanvasElement>;
}
export declare const loadSerializedSVG: (svg: Node) => Promise<HTMLImageElement>;
