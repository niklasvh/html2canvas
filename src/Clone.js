/* @flow */
'use strict';
import type {Bounds} from './Bounds';
import type {Options} from './index';
import type Logger from './Logger';

import ImageLoader from './ImageLoader';
import {copyCSSStyles} from './Util';
import {parseBackgroundImage} from './parsing/background';

export class DocumentCloner {
    scrolledElements: Array<[HTMLElement, number, number]>;
    referenceElement: HTMLElement;
    clonedReferenceElement: HTMLElement;
    documentElement: HTMLElement;
    imageLoader: ImageLoader<string>;
    logger: Logger;
    inlineImages: boolean;
    copyStyles: boolean;

    constructor(element: HTMLElement, options: Options, logger: Logger, copyInline: boolean) {
        this.referenceElement = element;
        this.scrolledElements = [];
        this.copyStyles = copyInline;
        this.inlineImages = copyInline;
        this.logger = logger;
        this.imageLoader = new ImageLoader(options, logger, window);
        // $FlowFixMe
        this.documentElement = this.cloneNode(element.ownerDocument.documentElement);
    }

    inlineAllImages(node: ?HTMLElement) {
        if (this.inlineImages && node) {
            const style = node.style;
            Promise.all(
                parseBackgroundImage(style.backgroundImage).map(backgroundImage => {
                    if (backgroundImage.method === 'url') {
                        return this.imageLoader
                            .inlineImage(backgroundImage.args[0])
                            .then(img => (img ? `url("${img.src}")` : 'none'))
                            .catch(e => {
                                if (__DEV__) {
                                    this.logger.log(`Unable to load image`, e);
                                }
                            });
                    }
                    return Promise.resolve(
                        `${backgroundImage.prefix}${backgroundImage.method}(${backgroundImage.args.join(
                            ','
                        )})`
                    );
                })
            ).then(backgroundImages => {
                if (backgroundImages.length > 1) {
                    // TODO Multiple backgrounds somehow broken in Chrome
                    style.backgroundColor = '';
                }
                style.backgroundImage = backgroundImages.join(',');
            });

            if (node instanceof HTMLImageElement) {
                this.imageLoader
                    .inlineImage(node.src)
                    .then(img => {
                        if (img && node instanceof HTMLImageElement && node.parentNode) {
                            const parentNode = node.parentNode;
                            const clonedChild = copyCSSStyles(node.style, img.cloneNode(false));
                            parentNode.replaceChild(clonedChild, node);
                        }
                    })
                    .catch(e => {
                        if (__DEV__) {
                            this.logger.log(`Unable to load image`, e);
                        }
                    });
            }
        }
    }

    createElementClone(node: Node) {
        if (this.copyStyles && node instanceof HTMLCanvasElement) {
            const img = node.ownerDocument.createElement('img');
            try {
                img.src = node.toDataURL();
                return img;
            } catch (e) {
                if (__DEV__) {
                    this.logger.log(`Unable to clone canvas contents, canvas is tainted`);
                }
            }
        }

        return node.cloneNode(false);
    }

    cloneNode(node: Node): Node {
        const clone =
            node.nodeType === Node.TEXT_NODE
                ? document.createTextNode(node.nodeValue)
                : this.createElementClone(node);

        if (this.referenceElement === node && clone instanceof HTMLElement) {
            this.clonedReferenceElement = clone;
        }

        if (clone instanceof HTMLBodyElement) {
            createPseudoHideStyles(clone);
        }

        for (let child = node.firstChild; child; child = child.nextSibling) {
            if (child.nodeType !== Node.ELEMENT_NODE || child.nodeName !== 'SCRIPT') {
                if (!this.copyStyles || child.nodeName !== 'STYLE') {
                    clone.appendChild(this.cloneNode(child));
                }
            }
        }
        if (node instanceof HTMLElement && clone instanceof HTMLElement) {
            this.inlineAllImages(inlinePseudoElement(node, clone, PSEUDO_BEFORE));
            this.inlineAllImages(inlinePseudoElement(node, clone, PSEUDO_AFTER));
            if (this.copyStyles) {
                copyCSSStyles(node.ownerDocument.defaultView.getComputedStyle(node), clone);
            }
            this.inlineAllImages(clone);
            if (node.scrollTop !== 0 || node.scrollLeft !== 0) {
                this.scrolledElements.push([node, node.scrollLeft, node.scrollTop]);
            }
            switch (node.nodeName) {
                case 'CANVAS':
                    if (!this.copyStyles) {
                        // $FlowFixMe
                        cloneCanvasContents(node, clone);
                    }
                    break;
                case 'TEXTAREA':
                case 'SELECT':
                    // $FlowFixMe
                    clone.value = node.value;
                    break;
            }
        }
        return clone;
    }
}

const restoreOwnerScroll = (ownerDocument: Document, x: number, y: number) => {
    if (
        ownerDocument.defaultView &&
        (x !== ownerDocument.defaultView.pageXOffset || y !== ownerDocument.defaultView.pageYOffset)
    ) {
        ownerDocument.defaultView.scrollTo(x, y);
    }
};

const cloneCanvasContents = (canvas: HTMLCanvasElement, clonedCanvas: HTMLCanvasElement) => {
    try {
        if (clonedCanvas) {
            clonedCanvas.width = canvas.width;
            clonedCanvas.height = canvas.height;
            clonedCanvas
                .getContext('2d')
                .putImageData(
                    canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height),
                    0,
                    0
                );
        }
    } catch (e) {}
};

const inlinePseudoElement = (
    node: HTMLElement,
    clone: HTMLElement,
    pseudoElt: ':before' | ':after'
): ?HTMLElement => {
    const style = node.ownerDocument.defaultView.getComputedStyle(node, pseudoElt);
    if (
        !style ||
        !style.content ||
        style.content === 'none' ||
        style.content === '-moz-alt-content' ||
        style.display === 'none'
    ) {
        return;
    }

    const content = stripQuotes(style.content);
    const image = content.match(URL_REGEXP);
    const anonymousReplacedElement = clone.ownerDocument.createElement(
        image ? 'img' : 'html2canvaspseudoelement'
    );
    if (image) {
        // $FlowFixMe
        anonymousReplacedElement.src = stripQuotes(image[1]);
    } else {
        anonymousReplacedElement.textContent = content;
    }

    copyCSSStyles(style, anonymousReplacedElement);

    anonymousReplacedElement.className = `${PSEUDO_HIDE_ELEMENT_CLASS_BEFORE} ${PSEUDO_HIDE_ELEMENT_CLASS_AFTER}`;
    clone.className +=
        pseudoElt === PSEUDO_BEFORE
            ? ` ${PSEUDO_HIDE_ELEMENT_CLASS_BEFORE}`
            : ` ${PSEUDO_HIDE_ELEMENT_CLASS_AFTER}`;
    if (pseudoElt === PSEUDO_BEFORE) {
        clone.insertBefore(anonymousReplacedElement, clone.firstChild);
    } else {
        clone.appendChild(anonymousReplacedElement);
    }

    return anonymousReplacedElement;
};

const stripQuotes = (content: string): string => {
    const first = content.substr(0, 1);
    return first === content.substr(content.length - 1) && first.match(/['"]/)
        ? content.substr(1, content.length - 2)
        : content;
};

const URL_REGEXP = /^url\((.+)\)$/i;
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

const createStyles = (body: HTMLElement, styles) => {
    const style = body.ownerDocument.createElement('style');
    style.innerHTML = styles;
    body.appendChild(style);
};

const initNode = ([element, x, y]: [HTMLElement, number, number]) => {
    element.scrollLeft = x;
    element.scrollTop = y;
};

export const cloneWindow = (
    ownerDocument: Document,
    bounds: Bounds,
    referenceElement: HTMLElement,
    options: Options,
    logger: Logger
): Promise<[HTMLIFrameElement, HTMLElement]> => {
    const cloner = new DocumentCloner(referenceElement, options, logger, false);
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
    if (ownerDocument.body) {
        ownerDocument.body.appendChild(cloneIframeContainer);
    } else {
        return Promise.reject(
            __DEV__ ? `Body element not found in Document that is getting rendered` : ''
        );
    }
    return new Promise((resolve, reject) => {
        let cloneWindow = cloneIframeContainer.contentWindow;
        const documentClone = cloneWindow.document;

        /* Chrome doesn't detect relative background-images assigned in inline <style> sheets when fetched through getComputedStyle
         if window url is about:blank, we can assign the url to current by writing onto the document
         */
        cloneWindow.onload = cloneIframeContainer.onload = () => {
            const interval = setInterval(() => {
                if (documentClone.body.childNodes.length > 0) {
                    cloner.scrolledElements.forEach(initNode);
                    clearInterval(interval);
                    if (options.type === 'view') {
                        cloneWindow.scrollTo(bounds.left, bounds.top);
                        if (
                            /(iPad|iPhone|iPod)/g.test(navigator.userAgent) &&
                            (cloneWindow.scrollY !== bounds.top ||
                                cloneWindow.scrollX !== bounds.left)
                        ) {
                            documentClone.documentElement.style.top = -bounds.top + 'px';
                            documentClone.documentElement.style.left = -bounds.left + 'px';
                            documentClone.documentElement.style.position = 'absolute';
                        }
                    }
                    if (
                        cloner.clonedReferenceElement instanceof cloneWindow.HTMLElement ||
                        cloner.clonedReferenceElement instanceof HTMLElement
                    ) {
                        resolve([cloneIframeContainer, cloner.clonedReferenceElement]);
                    } else {
                        reject(
                            __DEV__
                                ? `Error finding the ${referenceElement.nodeName} in the cloned document`
                                : ''
                        );
                    }
                }
            }, 50);
        };

        documentClone.open();
        documentClone.write('<!DOCTYPE html><html></html>');
        // Chrome scrolls the parent document for some reason after the write to the cloned window???
        restoreOwnerScroll(referenceElement.ownerDocument, bounds.left, bounds.top);
        documentClone.replaceChild(
            documentClone.adoptNode(cloner.documentElement),
            documentClone.documentElement
        );
        documentClone.close();
    });
};
