import { ElementContainer } from '../element-container';
import { Context } from '../../core/context';
export declare class ImageElementContainer extends ElementContainer {
    src: string;
    intrinsicWidth: number;
    intrinsicHeight: number;
    constructor(context: Context, img: HTMLImageElement);
}
