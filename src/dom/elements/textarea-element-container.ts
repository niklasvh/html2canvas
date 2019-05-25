import {ElementContainer} from '../element-container';
export class TextareaElementContainer extends ElementContainer {
    readonly value: string;
    constructor(element: HTMLTextAreaElement) {
        super(element);
        this.value = element.value;
    }
}
