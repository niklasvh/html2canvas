import {ElementContainer} from '../element-container';
import {Context} from '../../core/context';
export class OLElementContainer extends ElementContainer {
    readonly start: number;
    readonly reversed: boolean;

    constructor(context: Context, element: HTMLOListElement) {
        super(context, element);
        this.start = element.start;
        this.reversed = typeof element.reversed === 'boolean' && element.reversed === true;
    }
}
