import {ElementContainer} from '../element-container';
export class SelectElementContainer extends ElementContainer {
    readonly value: string;
    constructor(element: HTMLSelectElement) {
        super(element);
        const option = element.options[element.selectedIndex || 0];
        this.value = option ? option.text || '' : '';
    }
}
