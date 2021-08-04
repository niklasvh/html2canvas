import {ElementContainer} from '../element-container';
import {Context} from '../../core/context';
export class TextareaElementContainer extends ElementContainer {
    readonly value: string;
    constructor(context: Context, element: HTMLTextAreaElement) {
        super(context, element);
        this.value = element.value;
    }
}
