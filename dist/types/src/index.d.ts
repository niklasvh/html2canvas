import { CloneOptions } from './dom/document-cloner';
import { ResourceOptions } from './core/cache-storage';
import { RenderOptions } from './render/canvas/canvas-renderer';
export declare type Options = CloneOptions & RenderOptions & ResourceOptions & {
    backgroundColor: string | null;
    foreignObjectRendering: boolean;
    logging: boolean;
    removeContainer?: boolean;
};
declare const html2canvas: (element: HTMLElement, options?: Partial<Options>) => Promise<HTMLCanvasElement>;
export default html2canvas;
