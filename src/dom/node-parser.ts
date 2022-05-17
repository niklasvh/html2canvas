import {CSSParsedDeclaration} from '../css';
import {ElementContainer, FLAGS} from './element-container';
import {TextContainer} from './text-container';
import {ImageElementContainer} from './replaced-elements/image-element-container';
import {CanvasElementContainer} from './replaced-elements/canvas-element-container';
import {SVGElementContainer} from './replaced-elements/svg-element-container';
import {LIElementContainer} from './elements/li-element-container';
import {OLElementContainer} from './elements/ol-element-container';
import {InputElementContainer} from './replaced-elements/input-element-container';
import {SelectElementContainer} from './elements/select-element-container';
import {TextareaElementContainer} from './elements/textarea-element-container';
import {IFrameElementContainer} from './replaced-elements/iframe-element-container';
import {Context} from '../core/context';

const LIST_OWNERS = ['OL', 'UL', 'MENU'];

const parseNodeTree = (context: Context, node: Node, parent: ElementContainer, root: ElementContainer) => {
    for (let childNode = node.firstChild, nextNode; childNode; childNode = nextNode) {
        nextNode = childNode.nextSibling;

        if (isTextNode(childNode) && childNode.data.trim().length > 0) {
            parent.textNodes.push(new TextContainer(context, childNode, parent.styles));
        } else if (isElementNode(childNode)) {
            if (isSlotElement(childNode) && childNode.assignedNodes) {
                childNode.assignedNodes().forEach((childNode) => parseNodeTree(context, childNode, parent, root));
            } else {
                const container = createContainer(context, childNode);
                if (container.styles.isVisible()) {
                    if (createsRealStackingContext(childNode, container, root)) {
                        container.flags |= FLAGS.CREATES_REAL_STACKING_CONTEXT;
                    } else if (createsStackingContext(container.styles)) {
                        container.flags |= FLAGS.CREATES_STACKING_CONTEXT;
                    }

                    if (LIST_OWNERS.indexOf(childNode.tagName) !== -1) {
                        container.flags |= FLAGS.IS_LIST_OWNER;
                    }

                    parent.elements.push(container);
                    childNode.slot;
                    if (childNode.shadowRoot) {
                        parseNodeTree(context, childNode.shadowRoot, container, root);
                    } else if (
                        !isTextareaElement(childNode) &&
                        !isSVGElement(childNode) &&
                        !isSelectElement(childNode)
                    ) {
                        parseNodeTree(context, childNode, container, root);
                    }
                }
            }
        }
    }
};

const createContainer = (context: Context, element: Element): ElementContainer => {
    if (isImageElement(element)) {
        return new ImageElementContainer(context, element);
    }

    if (isCanvasElement(element)) {
        return new CanvasElementContainer(context, element);
    }

    if (isSVGElement(element)) {
        return new SVGElementContainer(context, element);
    }

    if (isLIElement(element)) {
        return new LIElementContainer(context, element);
    }

    if (isOLElement(element)) {
        return new OLElementContainer(context, element);
    }

    if (isInputElement(element)) {
        return new InputElementContainer(context, element);
    }

    if (isSelectElement(element)) {
        return new SelectElementContainer(context, element);
    }

    if (isTextareaElement(element)) {
        return new TextareaElementContainer(context, element);
    }

    if (isIFrameElement(element)) {
        return new IFrameElementContainer(context, element);
    }

    return new ElementContainer(context, element);
};

export const parseTree = (context: Context, element: HTMLElement): ElementContainer => {
    const container = createContainer(context, element);
    container.flags |= FLAGS.CREATES_REAL_STACKING_CONTEXT;
    parseNodeTree(context, element, container, container);
    return container;
};

const createsRealStackingContext = (node: Element, container: ElementContainer, root: ElementContainer): boolean => {
    return (
        container.styles.isPositionedWithZIndex() ||
        container.styles.opacity < 1 ||
        container.styles.isTransformed() ||
        (isBodyElement(node) && root.styles.isTransparent())
    );
};

const createsStackingContext = (styles: CSSParsedDeclaration): boolean => styles.isPositioned() || styles.isFloating();

export const isTextNode = (node: Node): node is Text => node.nodeType === Node.TEXT_NODE;
export const isElementNode = (node: Node): node is Element => node.nodeType === Node.ELEMENT_NODE;
export const isHTMLElementNode = (node: Node): node is HTMLElement =>
    isElementNode(node) && typeof (node as HTMLElement).style !== 'undefined' && !isSVGElementNode(node);
export const isSVGElementNode = (element: Element): element is SVGElement =>
    typeof (element as SVGElement).className === 'object';
export const isLIElement = (node: Element): node is HTMLLIElement => node.tagName === 'LI';
export const isOLElement = (node: Element): node is HTMLOListElement => node.tagName === 'OL';
export const isInputElement = (node: Element): node is HTMLInputElement => node.tagName === 'INPUT';
export const isHTMLElement = (node: Element): node is HTMLHtmlElement => node.tagName === 'HTML';
export const isSVGElement = (node: Element): node is SVGSVGElement => node.tagName === 'svg';
export const isBodyElement = (node: Element): node is HTMLBodyElement => node.tagName === 'BODY';
export const isCanvasElement = (node: Element): node is HTMLCanvasElement => node.tagName === 'CANVAS';
export const isVideoElement = (node: Element): node is HTMLVideoElement => node.tagName === 'VIDEO';
export const isImageElement = (node: Element): node is HTMLImageElement => node.tagName === 'IMG';
export const isIFrameElement = (node: Element): node is HTMLIFrameElement => node.tagName === 'IFRAME';
export const isStyleElement = (node: Element): node is HTMLStyleElement => node.tagName === 'STYLE';
export const isScriptElement = (node: Element): node is HTMLScriptElement => node.tagName === 'SCRIPT';
export const isTextareaElement = (node: Element): node is HTMLTextAreaElement => node.tagName === 'TEXTAREA';
export const isSelectElement = (node: Element): node is HTMLSelectElement => node.tagName === 'SELECT';
export const isSlotElement = (node: Element): node is HTMLSlotElement => node.tagName === 'SLOT';
// https://html.spec.whatwg.org/multipage/custom-elements.html#valid-custom-element-name
export const isCustomElement = (node: Element): node is HTMLElement => node.tagName.indexOf('-') > 0;
