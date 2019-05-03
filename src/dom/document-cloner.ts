import {Bounds} from "../css/layout/bounds";
import {
    isBodyElement, isCanvasElement, isElementNode, isHTMLElementNode, isIFrameElement, isScriptElement, isSelectElement,
    isStyleElement,
    isTextareaElement,
    isTextNode
} from "./node-parser";
import {Logger} from "../core/logger";

export type CloneOptions = {
    ignoreElements?: (element: Element) => boolean
    onclone?: (document: Document) => void
};

export type CloneConfigurations = CloneOptions & {
    inlineImages: boolean
    copyStyles: boolean
};

const IGNORE_ATTRIBUTE = 'data-html2canvas-ignore';

export class DocumentCloner {
    private readonly scrolledElements: Array<[Element, number, number]>;
    private readonly options: CloneConfigurations;
    private readonly  referenceElement: HTMLElement;
    clonedReferenceElement?: HTMLElement;
    private readonly documentElement: HTMLElement;

    constructor(element: HTMLElement, options: CloneConfigurations) {
        this.options = options;
        this.scrolledElements = [];
        this.referenceElement = element;
        if (!element.ownerDocument) {
            throw new Error('Cloned element does not have an owner document');
        }
        this.documentElement = <HTMLElement>this.cloneNode(element.ownerDocument.documentElement);
    }

    toIFrame(ownerDocument: Document, windowSize: Bounds): Promise<HTMLIFrameElement> {
        const iframe: HTMLIFrameElement = createIFrameContainer(ownerDocument, windowSize);


        if (!iframe.contentWindow) {
            return Promise.reject(`Unable to find iframe window`);
        }

        const cloneWindow = iframe.contentWindow;
        const documentClone: Document = cloneWindow.document;

        /* Chrome doesn't detect relative background-images assigned in inline <style> sheets when fetched through getComputedStyle
         if window url is about:blank, we can assign the url to current by writing onto the document
         */

        const iframeLoad = iframeLoader(iframe).then(() => {
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

            if (typeof this.clonedReferenceElement === 'undefined') {
                return Promise.reject(`Error finding the ${this.referenceElement.nodeName} in the cloned document`);
            }

            if (typeof onclone === 'function') {
                return Promise.resolve().then(() => onclone(documentClone)).then(() => iframe);
            }

            return iframe;
        });

        documentClone.open();
        documentClone.write(`${serializeDoctype(document.doctype)}<html></html>`);
        // Chrome scrolls the parent document for some reason after the write to the cloned window???
        restoreOwnerScroll(this.referenceElement.ownerDocument, scrollX, scrollY);
        documentClone.replaceChild(
            documentClone.adoptNode(this.documentElement),
            documentClone.documentElement
        );
        documentClone.close();

        return iframeLoad;
    }

    createElementClone(node: HTMLElement): HTMLElement {
        if (isCanvasElement(node)) {
            return this.createCanvasClone(node);
        }
/*
        if (isIFrameElement(node)) {
            return this.createIFrameClone(node);
        }
*/
        if (isStyleElement(node)) {
            return this.createStyleClone(node);
        }


        return <HTMLElement>node.cloneNode(false);
    }

    createStyleClone(node: HTMLStyleElement):HTMLStyleElement {
        try {
            const sheet = <CSSStyleSheet | undefined>node.sheet;
            if (sheet && sheet.cssRules) {
                const css: string = [].slice.call(sheet.cssRules, 0).reduce((css: string, rule: CSSRule) => {
                    if (rule && rule.cssText) {
                        return css + rule.cssText;
                    }
                    return css;
                }, '');
                const style = <HTMLStyleElement>node.cloneNode(false);
                style.textContent = css;
                return style;
            }
        } catch (e) {
            // accessing node.sheet.cssRules throws a DOMException
            Logger.error('Unable to access cssRules property', e);
            if (e.name !== 'SecurityError') {
                throw e;
            }
        }
        return <HTMLStyleElement>node.cloneNode(false);
    }

    createCanvasClone(canvas: HTMLCanvasElement): HTMLImageElement | HTMLCanvasElement {
        if (this.options.inlineImages && canvas.ownerDocument) {
            const img = canvas.ownerDocument.createElement('img');
            try {
                img.src = canvas.toDataURL();
                return img;
            } catch (e) {
                Logger.info(`Unable to clone canvas contents, canvas is tainted`);
            }
        }

        const clonedCanvas = <HTMLCanvasElement>canvas.cloneNode(false);

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
/*
    createIFrameClone(iframe: HTMLIFrameElement) {
        const tempIframe = <HTMLIFrameElement>iframe.cloneNode(false);
        const iframeKey = generateIframeKey();
        tempIframe.setAttribute('data-html2canvas-internal-iframe-key', iframeKey);

        const {width, height} = parseBounds(iframe);

        this.resourceLoader.cache[iframeKey] = getIframeDocumentElement(iframe, this.options)
            .then(documentElement => {
                return this.renderer(
                    documentElement,
                    {
                        allowTaint: this.options.allowTaint,
                        backgroundColor: '#ffffff',
                        canvas: null,
                        imageTimeout: this.options.imageTimeout,
                        logging: this.options.logging,
                        proxy: this.options.proxy,
                        removeContainer: this.options.removeContainer,
                        scale: this.options.scale,
                        foreignObjectRendering: this.options.foreignObjectRendering,
                        useCORS: this.options.useCORS,
                        target: new CanvasRenderer(),
                        width,
                        height,
                        x: 0,
                        y: 0,
                        windowWidth: documentElement.ownerDocument.defaultView.innerWidth,
                        windowHeight: documentElement.ownerDocument.defaultView.innerHeight,
                        scrollX: documentElement.ownerDocument.defaultView.pageXOffset,
                        scrollY: documentElement.ownerDocument.defaultView.pageYOffset
                    },
                );
            })
            .then(
                (canvas: HTMLCanvasElement) =>
                    new Promise((resolve, reject) => {
                        const iframeCanvas = document.createElement('img');
                        iframeCanvas.onload = () => resolve(canvas);
                        iframeCanvas.onerror = (event) => {
                            // Empty iframes may result in empty "data:," URLs, which are invalid from the <img>'s point of view
                            // and instead of `onload` cause `onerror` and unhandled rejection warnings
                            // https://github.com/niklasvh/html2canvas/issues/1502
                            iframeCanvas.src == 'data:,' ? resolve(canvas) : reject(event);
                        };
                        iframeCanvas.src = canvas.toDataURL();
                        if (tempIframe.parentNode && iframe.ownerDocument && iframe.ownerDocument.defaultView) {
                            tempIframe.parentNode.replaceChild(
                                copyCSSStyles(
                                    iframe.ownerDocument.defaultView.getComputedStyle(iframe),
                                    iframeCanvas
                                ),
                                tempIframe
                            );
                        }
                    })
            );
        return tempIframe;
    }
*/
    cloneNode(node: Node): Node {
        if (isTextNode(node)) {
            return document.createTextNode(node.data);
        }

        if (!node.ownerDocument) {
            return node.cloneNode(false);
        }

        const window = node.ownerDocument.defaultView;

        if (isHTMLElementNode(node) && window) {
            const clone = this.createElementClone(node);

            const style = window.getComputedStyle(node);
       //     const styleBefore = window.getComputedStyle(node, ':before');
        //    const styleAfter = window.getComputedStyle(node, ':after');

            if (this.referenceElement === node) {
                this.clonedReferenceElement = clone;
            }
            if (isBodyElement(clone)) {
                //createPseudoHideStyles(clone);
            }

        //    const counters = parseCounterReset(style, this.pseudoContentData);
        //    const contentBefore = resolvePseudoContent(node, styleBefore, this.pseudoContentData);

            for (let child = node.firstChild; child; child = child.nextSibling) {
                if (
                    !isElementNode(child) ||
                    (!isScriptElement(child) &&
                    !child.hasAttribute(IGNORE_ATTRIBUTE) &&
                    (typeof this.options.ignoreElements !== 'function' ||
                    !this.options.ignoreElements(child)))
                ) {
                    if (!this.options.copyStyles || !isElementNode(child) || !isStyleElement(child)) {
                        clone.appendChild(this.cloneNode(child));
                    }
                }
            }
/*
            const contentAfter = resolvePseudoContent(node, styleAfter, this.pseudoContentData);
            popCounters(counters, this.pseudoContentData);

            if (styleBefore) {
                this.inlineAllImages(
                    inlinePseudoElement(node, clone, styleBefore, contentBefore, PSEUDO_BEFORE)
                );
            }
            if (styleAfter) {
                this.inlineAllImages(
                    inlinePseudoElement(node, clone, styleAfter, contentAfter, PSEUDO_AFTER)
                );
            }*/
            if (style && this.options.copyStyles && !isIFrameElement(node)) {
                copyCSSStyles(style, clone);
            }

            //this.inlineAllImages(clone);

            if (node.scrollTop !== 0 || node.scrollLeft !== 0) {
                this.scrolledElements.push([clone, node.scrollLeft, node.scrollTop]);
            }

            if ((isTextareaElement(node) || isSelectElement(node)) && (isTextareaElement(clone) || isSelectElement(clone))) {
                clone.value = node.value;
            }

            return clone;
        }

        return node.cloneNode(false);
    }


}

const createIFrameContainer = (
    ownerDocument: Document,
    bounds: Bounds
): HTMLIFrameElement => {
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

const iframeLoader = (iframe: HTMLIFrameElement): Promise<HTMLIFrameElement> => {
    return new Promise((resolve, reject) => {
        const cloneWindow = iframe.contentWindow;

        if (!cloneWindow) {
            return reject(`No window assigned for iframe`);
        }

        const documentClone = cloneWindow.document;

        cloneWindow.onload = iframe.onload = documentClone.onreadystatechange = () => {
            const interval = setInterval(() => {
                if (
                    documentClone.body.childNodes.length > 0 &&
                    documentClone.readyState === 'complete'
                ) {
                    clearInterval(interval);
                    resolve(iframe);
                }
            }, 50);
        };
    });
};

export const copyCSSStyles = (style: CSSStyleDeclaration, target: HTMLElement): HTMLElement => {
    // Edge does not provide value for cssText
    for (let i = style.length - 1; i >= 0; i--) {
        const property = style.item(i);
        // Safari shows pseudoelements if content is set
        if (property !== 'content') {
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
