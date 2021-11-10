import { ElementContainer } from '../element-container';
import { Context } from '../../core/context';
export declare class CanvasElementContainer extends ElementContainer {
    canvas: HTMLCanvasElement;
    intrinsicWidth: number;
    intrinsicHeight: number;
    constructor(context: Context, canvas: HTMLCanvasElement);
}
