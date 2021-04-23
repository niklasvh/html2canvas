import { ElementContainer } from '../element-container';
export declare class CanvasElementContainer extends ElementContainer {
    canvas: HTMLCanvasElement;
    intrinsicWidth: number;
    intrinsicHeight: number;
    constructor(canvas: HTMLCanvasElement);
}
