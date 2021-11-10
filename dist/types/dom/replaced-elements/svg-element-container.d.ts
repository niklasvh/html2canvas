import { ElementContainer } from '../element-container';
import { Context } from '../../core/context';
export declare class SVGElementContainer extends ElementContainer {
    svg: string;
    intrinsicWidth: number;
    intrinsicHeight: number;
    constructor(context: Context, img: SVGSVGElement);
}
