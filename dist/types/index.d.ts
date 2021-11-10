import { CloneOptions, WindowOptions } from './dom/document-cloner';
import { RenderOptions } from './render/canvas/canvas-renderer';
import { ContextOptions } from './core/context';
export declare type Options = CloneOptions & WindowOptions & RenderOptions & ContextOptions & {
    backgroundColor: string | null;
    foreignObjectRendering: boolean;
    removeContainer?: boolean;
};
declare const html2canvas: (element: HTMLElement, options?: Partial<Options>) => Promise<HTMLCanvasElement>;
export default html2canvas;
