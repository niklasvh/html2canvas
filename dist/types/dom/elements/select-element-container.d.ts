import { ElementContainer } from '../element-container';
import { Context } from '../../core/context';
export declare class SelectElementContainer extends ElementContainer {
    readonly value: string;
    constructor(context: Context, element: HTMLSelectElement);
}
