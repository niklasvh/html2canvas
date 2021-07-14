import {Bounds} from '../css/layout/bounds';
import {
    isBodyElement,
    isCanvasElement,
    isElementNode,
    isHTMLElementNode,
    isIFrameElement,
    isImageElement,
    isScriptElement,
    isSelectElement,
    isStyleElement,
    isSVGElementNode,
    isTextareaElement,
    isTextNode
} from './node-parser';
import {Logger} from '../core/logger';
import {isIdentToken, nonFunctionArgSeparator} from '../css/syntax/parser';
import {TokenType} from '../css/syntax/tokenizer';
import {CounterState, createCounterText} from '../css/types/functions/counter';
import {LIST_STYLE_TYPE, listStyleType} from '../css/property-descriptors/list-style-type';
import {CSSParsedCounterDeclaration, CSSParsedPseudoDeclaration} from '../css/index';
import {getQuote} from '../css/property-descriptors/quotes';

export interface CloneOptions {
    id: string;
    ignoreElements?: (element: Element) => boolean;
    onclone?: (document: Document, element: HTMLElement) => void;
}

export type CloneConfigurations = CloneOptions & {
    inlineImages: boolean;
    copyStyles: boolean;
};

const IGNORE_ATTRIBUTE = 'data-html2canvas-ignore';

export class DocumentCloner {
    private readonly scrolledElements: [Element, number, number][];
    private readonly options: CloneConfigurations;
    private readonly referenceElement: HTMLElement;
    clonedReferenceElement?: HTMLElement;
    private readonly documentElement: HTMLElement;
    private readonly counters: CounterState;
    private quoteDepth: number;

    constructor(element: HTMLElement, options: CloneConfigurations) {
        this.options = options;
        this.scrolledElements = [];
        this.referenceElement = element;
        this.counters = new CounterState();
        this.quoteDepth = 0;
        if (!element.ownerDocument) {
            throw new Error('Cloned element does not have an owner document');
        }

        this.documentElement = this.cloneNode(element.ownerDocument.documentElement) as HTMLElement;
    }

    toIFrame(ownerDocument: Document, windowSize: Bounds): Promise<HTMLIFrameElement> {
        const iframe: HTMLIFrameElement = createIFrameContainer(ownerDocument, windowSize);

        if (!iframe.contentWindow) {
            return Promise.reject(`Unable to find iframe window`);
        }

        const scrollX = (ownerDocument.defaultView as Window).pageXOffset;
        const scrollY = (ownerDocument.defaultView as Window).pageYOffset;

        const cloneWindow = iframe.contentWindow;
        const documentClone: Document = cloneWindow.document;

        /* Chrome doesn't detect relative background-images assigned in inline <style> sheets when fetched through getComputedStyle
         if window url is about:blank, we can assign the url to current by writing onto the document
         */

        const iframeLoad = iframeLoader(iframe).then(async () => {
            this.scrolledElements.forEach(restoreNodeScroll);
            if (cloneWindow) {
                cloneWindow.scrollTo(windowSize.left, windowSize.top);
                if (
                    /(iPad|iPhone|iPod)/g.test(navigator.userAgent) &&
                    (cloneWindow.scrollY !== windowSize.top || cloneWindow.scrollX !== windowSize.left)
                ) {
                    documentClone.documentElement.style.top = -windowSize.top + 'px';
                    documentClone.documentElement.style.left = -windowSize.left + 'px';
                    documentClone.documentElement.style.position = 'absolute';
                }
            }

            const onclone = this.options.onclone;

            const referenceElement = this.clonedReferenceElement;

            if (typeof referenceElement === 'undefined') {
                return Promise.reject(`Error finding the ${this.referenceElement.nodeName} in the cloned document`);
            }

            if (documentClone.fonts && documentClone.fonts.ready) {
                await documentClone.fonts.ready;
            }

            if (/(AppleWebKit)/g.test(navigator.userAgent)) {
                await imagesReady(documentClone);
            }

            if (typeof onclone === 'function') {
                return Promise.resolve()
                    .then(() => onclone(documentClone, referenceElement))
                    .then(() => iframe);
            }

            return iframe;
        });

        documentClone.open();
        documentClone.write(`${serializeDoctype(document.doctype)}<html></html>`);
        // Chrome scrolls the parent document for some reason after the write to the cloned window???
        restoreOwnerScroll(this.referenceElement.ownerDocument, scrollX, scrollY);
        documentClone.replaceChild(documentClone.adoptNode(this.documentElement), documentClone.documentElement);
        documentClone.close();

        return iframeLoad;
    }

    createElementClone<T extends HTMLElement | SVGElement>(node: T): HTMLElement | SVGElement {
        if (isCanvasElement(node)) {
            return this.createCanvasClone(node);
        }

        if (isStyleElement(node)) {
            return this.createStyleClone(node);
        }

        const clone = node.cloneNode(false) as T;
        if (isImageElement(clone) && clone.loading === 'lazy') {
            clone.loading = 'eager';
        }

        return clone;
    }

    createStyleClone(node: HTMLStyleElement): HTMLStyleElement {
        try {
            const sheet = node.sheet as CSSStyleSheet | undefined;
            if (sheet && sheet.cssRules) {
                const css: string = [].slice.call(sheet.cssRules, 0).reduce((css: string, rule: CSSRule) => {
                    if (rule && typeof rule.cssText === 'string') {
                        return css + rule.cssText;
                    }
                    return css;
                }, '');
                const style = node.cloneNode(false) as HTMLStyleElement;
                style.textContent = css;
                return style;
            }
        } catch (e) {
            // accessing node.sheet.cssRules throws a DOMException
            Logger.getInstance(this.options.id).error('Unable to access cssRules property', e);
            if (e.name !== 'SecurityError') {
                throw e;
            }
        }
        return node.cloneNode(false) as HTMLStyleElement;
    }

    createCanvasClone(canvas: HTMLCanvasElement): HTMLImageElement | HTMLCanvasElement {
        if (this.options.inlineImages && canvas.ownerDocument) {
            const img = canvas.ownerDocument.createElement('img');
            try {
                img.src = canvas.toDataURL();
                return img;
            } catch (e) {
                Logger.getInstance(this.options.id).info(`Unable to clone canvas contents, canvas is tainted`);
            }
        }

        const clonedCanvas = canvas.cloneNode(false) as HTMLCanvasElement;

        try {
            clonedCanvas.width = canvas.width;
            clonedCanvas.height = canvas.height;
            const ctx = canvas.getContext('2d');
            const clonedCtx = clonedCanvas.getContext('2d');
            if (clonedCtx) {
                if (ctx) {
                    clonedCtx.putImageData(ctx.getImageData(0, 0, canvas.width, canvas.height), 0, 0);
                } else {
                    clonedCtx.drawImage(canvas, 0, 0);
                }
            }
            return clonedCanvas;
        } catch (e) {}

        return clonedCanvas;
    }

    cloneNode(node: Node): Node {
        if (isTextNode(node)) {
            return document.createTextNode(node.data);
        }

        if (!node.ownerDocument) {
            return node.cloneNode(false);
        }

        const window = node.ownerDocument.defaultView;

        if (window && isElementNode(node) && (isHTMLElementNode(node) || isSVGElementNode(node))) {
            const clone = this.createElementClone(node);

            const style = window.getComputedStyle(node);
            const styleBefore = window.getComputedStyle(node, ':before');
            const styleAfter = window.getComputedStyle(node, ':after');

            if (this.referenceElement === node && isHTMLElementNode(clone)) {
                this.clonedReferenceElement = clone;
            }
            if (isBodyElement(clone)) {
                createPseudoHideStyles(clone);
            }

            const counters = this.counters.parse(new CSSParsedCounterDeclaration(style));
            const before = this.resolvePseudoContent(node, clone, styleBefore, PseudoElementType.BEFORE);

            for (let child = node.firstChild; child; child = child.nextSibling) {
                if (
                    !isElementNode(child) ||
                    (!isScriptElement(child) &&
                        !child.hasAttribute(IGNORE_ATTRIBUTE) &&
                        (typeof this.options.ignoreElements !== 'function' || !this.options.ignoreElements(child)))
                ) {
                    if (!this.options.copyStyles || !isElementNode(child) || !isStyleElement(child)) {
                        clone.appendChild(this.cloneNode(child));
                    }
                }
            }

            if (before) {
                clone.insertBefore(before, clone.firstChild);
            }

            const after = this.resolvePseudoContent(node, clone, styleAfter, PseudoElementType.AFTER);
            if (after) {
                clone.appendChild(after);
            }

            this.counters.pop(counters);

            if (style && (this.options.copyStyles || isSVGElementNode(node)) && !isIFrameElement(node)) {
                copyCSSStyles(style, clone);
            }

            if (node.scrollTop !== 0 || node.scrollLeft !== 0) {
                this.scrolledElements.push([clone, node.scrollLeft, node.scrollTop]);
            }

            if (
                (isTextareaElement(node) || isSelectElement(node)) &&
                (isTextareaElement(clone) || isSelectElement(clone))
            ) {
                clone.value = node.value;
            }

            return clone;
        }

        return node.cloneNode(false);
    }

    resolvePseudoContent(
        node: Element,
        clone: Element,
        style: CSSStyleDeclaration,
        pseudoElt: PseudoElementType
    ): HTMLElement | void {
        if (!style) {
            return;
        }

        const value = style.content;
        const document = clone.ownerDocument;
        if (!document || !value || value === 'none' || value === '-moz-alt-content' || style.display === 'none') {
            return;
        }

        this.counters.parse(new CSSParsedCounterDeclaration(style));
        const declaration = new CSSParsedPseudoDeclaration(style);

        const anonymousReplacedElement = document.createElement('html2canvaspseudoelement');
        copyCSSStyles(style, anonymousReplacedElement);

        declaration.content.forEach((token) => {
            if (token.type === TokenType.STRING_TOKEN) {
                anonymousReplacedElement.appendChild(document.createTextNode(token.value));
            } else if (token.type === TokenType.URL_TOKEN) {
                const img = document.createElement('img');
                img.src = token.value;
                img.style.opacity = '1';
                anonymousReplacedElement.appendChild(img);
            } else if (token.type === TokenType.FUNCTION) {
                if (token.name === 'attr') {
                    const attr = token.values.filter(isIdentToken);
                    if (attr.length) {
                        anonymousReplacedElement.appendChild(
                            document.createTextNode(node.getAttribute(attr[0].value) || '')
                        );
                    }
                } else if (token.name === 'counter') {
                    const [counter, counterStyle] = token.values.filter(nonFunctionArgSeparator);
                    if (counter && isIdentToken(counter)) {
                        const counterState = this.counters.getCounterValue(counter.value);
                        const counterType =
                            counterStyle && isIdentToken(counterStyle)
                                ? listStyleType.parse(counterStyle.value)
                                : LIST_STYLE_TYPE.DECIMAL;

                        anonymousReplacedElement.appendChild(
                            document.createTextNode(createCounterText(counterState, counterType, false))
                        );
                    }
                } else if (token.name === 'counters') {
                    const [counter, delim, counterStyle] = token.values.filter(nonFunctionArgSeparator);
                    if (counter && isIdentToken(counter)) {
                        const counterStates = this.counters.getCounterValues(counter.value);
                        const counterType =
                            counterStyle && isIdentToken(counterStyle)
                                ? listStyleType.parse(counterStyle.value)
                                : LIST_STYLE_TYPE.DECIMAL;
                        const separator = delim && delim.type === TokenType.STRING_TOKEN ? delim.value : '';
                        const text = counterStates
                            .map((value) => createCounterText(value, counterType, false))
                            .join(separator);

                        anonymousReplacedElement.appendChild(document.createTextNode(text));
                    }
                } else {
                    //   console.log('FUNCTION_TOKEN', token);
                }
            } else if (token.type === TokenType.IDENT_TOKEN) {
                switch (token.value) {
                    case 'open-quote':
                        anonymousReplacedElement.appendChild(
                            document.createTextNode(getQuote(declaration.quotes, this.quoteDepth++, true))
                        );
                        break;
                    case 'close-quote':
                        anonymousReplacedElement.appendChild(
                            document.createTextNode(getQuote(declaration.quotes, --this.quoteDepth, false))
                        );
                        break;
                    default:
                        // safari doesn't parse string tokens correctly because of lack of quotes
                        anonymousReplacedElement.appendChild(document.createTextNode(token.value));
                }
            }
        });

        anonymousReplacedElement.className = `${PSEUDO_HIDE_ELEMENT_CLASS_BEFORE} ${PSEUDO_HIDE_ELEMENT_CLASS_AFTER}`;
        const newClassName =
            pseudoElt === PseudoElementType.BEFORE
                ? ` ${PSEUDO_HIDE_ELEMENT_CLASS_BEFORE}`
                : ` ${PSEUDO_HIDE_ELEMENT_CLASS_AFTER}`;

        if (isSVGElementNode(clone)) {
            clone.className.baseValue += newClassName;
        } else {
            clone.className += newClassName;
        }

        return anonymousReplacedElement;
    }

    static destroy(container: HTMLIFrameElement): boolean {
        if (container.parentNode) {
            container.parentNode.removeChild(container);
            return true;
        }
        return false;
    }
}

enum PseudoElementType {
    BEFORE,
    AFTER
}

const createIFrameContainer = (ownerDocument: Document, bounds: Bounds): HTMLIFrameElement => {
    const cloneIframeContainer = ownerDocument.createElement('iframe');

    cloneIframeContainer.className = 'html2canvas-container';
    cloneIframeContainer.style.visibility = 'hidden';
    cloneIframeContainer.style.position = 'fixed';
    cloneIframeContainer.style.left = '-10000px';
    cloneIframeContainer.style.top = '0px';
    cloneIframeContainer.style.border = '0';
    cloneIframeContainer.width = bounds.width.toString();
    cloneIframeContainer.height = bounds.height.toString();
    cloneIframeContainer.scrolling = 'no'; // ios won't scroll without it
    cloneIframeContainer.setAttribute(IGNORE_ATTRIBUTE, 'true');
    ownerDocument.body.appendChild(cloneIframeContainer);

    return cloneIframeContainer;
};

const imageReady = (img: HTMLImageElement): Promise<Event | void | string> => {
    return new Promise((resolve) => {
        if (img.complete) {
            resolve();
            return;
        }
        if (!img.src) {
            resolve();
            return;
        }
        img.onload = resolve;
        img.onerror = resolve;
    });
};

const imagesReady = (document: HTMLDocument): Promise<unknown[]> => {
    return Promise.all([].slice.call(document.images, 0).map(imageReady));
};

const iframeLoader = (iframe: HTMLIFrameElement): Promise<HTMLIFrameElement> => {
    return new Promise((resolve, reject) => {
        const cloneWindow = iframe.contentWindow;

        if (!cloneWindow) {
            return reject(`No window assigned for iframe`);
        }

        const documentClone = cloneWindow.document;

        cloneWindow.onload = iframe.onload = () => {
            cloneWindow.onload = iframe.onload = null;
            const interval = setInterval(() => {
                if (documentClone.body.childNodes.length > 0 && documentClone.readyState === 'complete') {
                    clearInterval(interval);
                    resolve(iframe);
                }
            }, 50);
        };
    });
};

export const copyCSSStyles = <T extends HTMLElement | SVGElement>(style: CSSStyleDeclaration, target: T): T => {
    // Edge does not provide value for cssText
    for (let i = style.length - 1; i >= 0; i--) {
        const property = style.item(i);
        // Safari shows pseudoelements if content is set
        if (property !== 'content' && property !== 'all') {
            target.style.setProperty(property, style.getPropertyValue(property));
        }
    }
    return target;
};

const serializeDoctype = (doctype?: DocumentType | null): string => {
    let str = '';
    if (doctype) {
        str += '<!DOCTYPE ';
        if (doctype.name) {
            str += doctype.name;
        }

        if (doctype.internalSubset) {
            str += doctype.internalSubset;
        }

        if (doctype.publicId) {
            str += `"${doctype.publicId}"`;
        }

        if (doctype.systemId) {
            str += `"${doctype.systemId}"`;
        }

        str += '>';
    }

    return str;
};

const restoreOwnerScroll = (ownerDocument: Document | null, x: number, y: number) => {
    if (
        ownerDocument &&
        ownerDocument.defaultView &&
        (x !== ownerDocument.defaultView.pageXOffset || y !== ownerDocument.defaultView.pageYOffset)
    ) {
        ownerDocument.defaultView.scrollTo(x, y);
    }
};

const restoreNodeScroll = ([element, x, y]: [HTMLElement, number, number]) => {
    element.scrollLeft = x;
    element.scrollTop = y;
};

const PSEUDO_BEFORE = ':before';
const PSEUDO_AFTER = ':after';
const PSEUDO_HIDE_ELEMENT_CLASS_BEFORE = '___html2canvas___pseudoelement_before';
const PSEUDO_HIDE_ELEMENT_CLASS_AFTER = '___html2canvas___pseudoelement_after';

const PSEUDO_HIDE_ELEMENT_STYLE = `{
    content: "" !important;
    display: none !important;
}`;

const createPseudoHideStyles = (body: HTMLElement) => {
    createStyles(
        body,
        `.${PSEUDO_HIDE_ELEMENT_CLASS_BEFORE}${PSEUDO_BEFORE}${PSEUDO_HIDE_ELEMENT_STYLE}
         .${PSEUDO_HIDE_ELEMENT_CLASS_AFTER}${PSEUDO_AFTER}${PSEUDO_HIDE_ELEMENT_STYLE}`
    );
};

const createStyles = (body: HTMLElement, styles: string) => {
    const document = body.ownerDocument;
    if (document) {
        const style = document.createElement('style');
        style.textContent = styles;
        body.appendChild(style);
    }
};
