import { ElementContainer } from '../element-container';
import { Color } from '../../css/types/color';
import { Context } from '../../core/context';
export declare class IFrameElementContainer extends ElementContainer {
    src: string;
    width: number;
    height: number;
    tree?: ElementContainer;
    backgroundColor: Color;
    constructor(context: Context, iframe: HTMLIFrameElement);
}
