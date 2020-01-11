import {ElementContainer} from '../element-container';
export class LIElementContainer extends ElementContainer {
    readonly value: number;

    constructor(element: HTMLLIElement) {
        super(element);
        this.value = element.value;
    }
}
