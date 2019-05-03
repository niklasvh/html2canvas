import {CSSParsedDeclaration} from "../css/index";
import {ElementContainer, FLAGS} from "./element-container";
import {TextContainer} from "./text-container";
import {ImageElementContainer} from "./replaced-elements/image-element-container";
import {CanvasElementContainer} from "./replaced-elements/canvas-element-container";
import {SVGElementContainer} from "./replaced-elements/svg-element-container";

const parseNodeTree = (node: Node, parent: ElementContainer, root: ElementContainer) => {
    for (let childNode = node.firstChild, nextNode; childNode; childNode = nextNode) {
        nextNode = childNode.nextSibling;

        if (isTextNode(childNode) && childNode.data.trim().length > 0) {
            parent.textNodes.push(new TextContainer(childNode, parent.styles));
        } else if (isElementNode(childNode)) {
            const container = createContainer(childNode);
            if (container.styles.isVisible()) {
                if (createsRealStackingContext(childNode, container, root)) {
                    container.flags |= FLAGS.CREATES_REAL_STACKING_CONTEXT;
                } else if (createsStackingContext(container.styles)) {
                    container.flags |= FLAGS.CREATES_STACKING_CONTEXT;
                }

                parent.elements.push(container);
                if (!isTextareaElement(childNode) && !isSVGElement(childNode)) {
                    parseNodeTree(childNode, container, root);
                }
            }
        }
    }
};

const createContainer = (element: Element): ElementContainer => {
    if (isImageElement(element)) {
        return new ImageElementContainer(element);
    }

    if (isCanvasElement(element)) {
        return new CanvasElementContainer(element);
    }

    if (isSVGElement(element)) {
        return new SVGElementContainer(element);
    }

    return new ElementContainer(element);
};

export const parseTree = (element: HTMLElement): ElementContainer => {
    const container = createContainer(element);
    container.flags |= FLAGS.CREATES_REAL_STACKING_CONTEXT;
    parseNodeTree(element, container, container);
    return container;
};


/*
export class NodeParser {
    readonly _root: StackingContext;

    constructor(element: HTMLElement) {
        this._root = new StackingContext(new ElementContainer(element, 0));
        this.parseNodeTree(element, this._root.element, this._root, this._root, 1);
    }

    parseNodeTree(node: Node, parent: ElementContainer, stackingContext: StackingContext, realStackingContext: StackingContext, index: number) {
        for (let childNode = node.firstChild, nextNode; childNode; childNode = nextNode) {
            nextNode = childNode.nextSibling;

            if (isTextNode(childNode) && childNode.data.trim().length > 0) {
                parent.textNodes.push(new TextContainer(childNode, parent.styles));
            } else if (isHTMLElementNode(childNode)) {
                const container = new ElementContainer(childNode, index++);

                if (container.styles.isVisible()) {
                    const treatAsRealStackingContext = this.createsRealStackingContext(childNode, container);
                    let parentRealStackingContext = realStackingContext;
                    let currentStackingContext = stackingContext;
                    if (treatAsRealStackingContext || createsStackingContext(container.styles)) {
                        const parentStack = treatAsRealStackingContext || container.styles.isPositioned()
                            ? realStackingContext
                            : stackingContext;

                        currentStackingContext = new StackingContext(container);
                        if (treatAsRealStackingContext) {
                            parentRealStackingContext = currentStackingContext;
                        }
                        parentStack.contexts.push(currentStackingContext);
                    } else {
                        currentStackingContext.children.push(container);
                    }

                    if (childNode.tagName !== 'TEXTAREA') {
                        this.parseNodeTree(childNode, container, currentStackingContext, parentRealStackingContext, index);
                    }
                }
            }
        }
    }

    private createsRealStackingContext(node: Element, container: ElementContainer): boolean  {
        return (
            container.styles.isPositionedWithZIndex() ||
            container.styles.opacity < 1 ||
            container.styles.isTransformed() ||
            (isBodyElement(node) && this._root.element.styles.isTransparent())
        );
    };
}
*/


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
export const isHTMLElementNode = (node: Node): node is HTMLElement => typeof (node as HTMLElement).style !== 'undefined';

export const isHTMLElement = (node: Element): node is HTMLHtmlElement => node.tagName === 'HTML';
export const isSVGElement = (node: Element): node is SVGSVGElement => node.tagName === 'svg';
export const isBodyElement = (node: Element): node is HTMLBodyElement => node.tagName === 'BODY';
export const isCanvasElement = (node: Element): node is HTMLCanvasElement => node.tagName === 'CANVAS';
export const isImageElement = (node: Element): node is HTMLImageElement => node.tagName === 'IMG';
export const isIFrameElement = (node: Element): node is HTMLIFrameElement => node.tagName === 'IFRAME';
export const isStyleElement = (node: Element): node is HTMLStyleElement => node.tagName === 'STYLE';
export const isScriptElement = (node: Element): node is HTMLScriptElement => node.tagName === 'SCRIPT';
export const isTextareaElement = (node: Element): node is HTMLTextAreaElement => node.tagName === 'TEXTAREA';
export const isSelectElement = (node: Element): node is HTMLSelectElement => node.tagName === 'SELECT';
