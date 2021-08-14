import {CSSParsedDeclaration} from '../css/index';
import {TextContainer} from './text-container';
import {Bounds, parseBounds} from '../css/layout/bounds';
import {isHTMLElementNode} from './node-parser';
import {Context} from '../core/context';

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

    constructor(protected readonly context: Context, element: Element) {
        this.styles = new CSSParsedDeclaration(context, window.getComputedStyle(element, null));
        this.textNodes = [];
        this.elements = [];

        if (isHTMLElementNode(element)) {
            if (this.styles.animationDuration.some((duration) => duration > 0)) {
                element.style.animationDuration = '0s';
            }
            if (this.styles.transitionDuration.some((duration) => duration > 0)) {
                element.style.transitionDuration = '0s';
            }

            if (this.styles.transform !== null) {
                // getBoundingClientRect takes transforms into account
                element.style.transform = 'none';
            }
        }

        this.bounds = parseBounds(this.context, element);
        this.flags = 0;
    }
}
