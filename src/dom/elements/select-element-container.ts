import {ElementContainer} from '../element-container';
import {Context} from '../../core/context';
export class SelectElementContainer extends ElementContainer {
    readonly value: string;
    constructor(context: Context, element: HTMLSelectElement) {
        super(context, element);
        const option = element.options[element.selectedIndex || 0];
        this.value = option ? option.text || '' : '';
    }
}
