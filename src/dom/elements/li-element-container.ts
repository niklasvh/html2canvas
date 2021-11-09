import {ElementContainer} from '../element-container';
import {Context} from '../../core/context';
export class LIElementContainer extends ElementContainer {
    readonly value: number;

    constructor(context: Context, element: HTMLLIElement) {
        super(context, element);
        this.value = element.value;
    }
}
