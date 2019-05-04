import {ElementContainer} from '../element-container';

export class CanvasElementContainer extends ElementContainer {
    canvas: HTMLCanvasElement;
    intrinsicWidth: number;
    intrinsicHeight: number;

    constructor(canvas: HTMLCanvasElement) {
        super(canvas);
        this.canvas = canvas;
        this.intrinsicWidth = canvas.width;
        this.intrinsicHeight = canvas.height;
    }
}
