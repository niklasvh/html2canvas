import { RenderConfigurations } from './canvas-renderer';
export declare class ForeignObjectRenderer {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    options: RenderConfigurations;
    constructor(options: RenderConfigurations);
    render(element: HTMLElement): Promise<HTMLCanvasElement>;
}
export declare const loadSerializedSVG: (svg: Node) => Promise<HTMLImageElement>;
