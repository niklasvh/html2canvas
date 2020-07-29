import {CSSParsedDeclaration} from '../css/index';
import {TextContainer} from './text-container';
import {Bounds, parseBounds} from '../css/layout/bounds';
import {isHTMLElementNode} from './node-parser';

export const enum FLAGS {
    CREATES_STACKING_CONTEXT = 1 << 1,
    CREATES_REAL_STACKING_CONTEXT = 1 << 2,
    IS_LIST_OWNER = 1 << 3
}

export class ElementContainer {
    readonly styles: CSSParsedDeclaration;
    readonly textNodes: TextContainer[];
    readonly elements: ElementContainer[];
    bounds: Bounds;
    flags: number;

    constructor(element: Element) {
        this.styles = new CSSParsedDeclaration(window.getComputedStyle(element, null));
        this.textNodes = [];
        this.elements = [];
        if (this.styles.transform !== null && isHTMLElementNode(element)) {
            // getBoundingClientRect takes transforms into account
            element.style.transform = 'none';
        }
        const ad = this.styles.animationDuration;
        const td = this.styles.transitionDuration;
        const style = (element as HTMLElement).style;
        if (style && (ad || td)) {
            style.animationDuration = '0ms';
            style.transitionDuration = '0ms';
        }
        this.bounds = parseBounds(element);
        this.flags = 0;
    }
}
