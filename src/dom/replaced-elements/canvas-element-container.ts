import {ElementContainer} from '../element-container';
import {Context} from '../../core/context';

export class CanvasElementContainer extends ElementContainer {
    canvas: HTMLCanvasElement;
    intrinsicWidth: number;
    intrinsicHeight: number;

    constructor(context: Context, canvas: HTMLCanvasElement) {
        super(context, canvas);
        this.canvas = canvas;
        this.intrinsicWidth = canvas.width;
        this.intrinsicHeight = canvas.height;
    }
}
