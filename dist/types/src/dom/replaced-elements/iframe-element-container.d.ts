import { ElementContainer } from '../element-container';
import { Color } from '../../css/types/color';
export declare class IFrameElementContainer extends ElementContainer {
    src: string;
    width: number;
    height: number;
    tree?: ElementContainer;
    backgroundColor: Color;
    constructor(iframe: HTMLIFrameElement);
}
