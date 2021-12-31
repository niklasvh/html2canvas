import { ElementContainer } from '../element-container';
import { Context } from '../../core/context';
export declare class OLElementContainer extends ElementContainer {
    readonly start: number;
    readonly reversed: boolean;
    constructor(context: Context, element: HTMLOListElement);
}
