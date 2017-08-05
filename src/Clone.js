/* @flow */
'use strict';
import type {Bounds} from './Bounds';
import type {Options} from './index';

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

const cloneNode = (
    node: Node,
    referenceElement: [HTMLElement, ?HTMLElement],
    scrolledElements: Array<[HTMLElement, number, number]>
) => {
    const clone =
        node.nodeType === Node.TEXT_NODE
            ? document.createTextNode(node.nodeValue)
            : node.cloneNode(false);

    if (referenceElement[0] === node && clone instanceof HTMLElement) {
        referenceElement[1] = clone;
    }

    for (let child = node.firstChild; child; child = child.nextSibling) {
        if (child.nodeType !== Node.ELEMENT_NODE || child.nodeName !== 'SCRIPT') {
            clone.appendChild(cloneNode(child, referenceElement, scrolledElements));
        }
    }

    if (node instanceof HTMLElement) {
        if (node.scrollTop !== 0 || node.scrollLeft !== 0) {
            scrolledElements.push([node, node.scrollLeft, node.scrollTop]);
        }
        switch (node.nodeName) {
            case 'CANVAS':
                // $FlowFixMe
                cloneCanvasContents(node, clone);
                break;
            case 'TEXTAREA':
            case 'SELECT':
                // $FlowFixMe
                clone.value = node.value;
                break;
        }
    }

    return clone;
};

const initNode = ([element, x, y]: [HTMLElement, number, number]) => {
    element.scrollLeft = x;
    element.scrollTop = y;
};

export const cloneWindow = (
    documentToBeCloned: Document,
    ownerDocument: Document,
    bounds: Bounds,
    referenceElement: HTMLElement,
    options: Options
): Promise<[HTMLIFrameElement, HTMLElement]> => {
    const scrolledElements = [];
    const referenceElementSearch = [referenceElement, null];
    if (!(documentToBeCloned.documentElement instanceof HTMLElement)) {
        return Promise.reject(__DEV__ ? `Invalid document provided for cloning` : '');
    }

    const documentElement = cloneNode(
        documentToBeCloned.documentElement,
        referenceElementSearch,
        scrolledElements
    );

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
            console.log('iframe load');
            const interval = setInterval(() => {
                if (documentClone.body.childNodes.length > 0) {
                    scrolledElements.forEach(initNode);
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
                        referenceElementSearch[1] instanceof cloneWindow.HTMLElement ||
                        referenceElementSearch[1] instanceof HTMLElement
                    ) {
                        resolve([cloneIframeContainer, referenceElementSearch[1]]);
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
        restoreOwnerScroll(documentToBeCloned, bounds.left, bounds.top);
        documentClone.replaceChild(
            documentClone.adoptNode(documentElement),
            documentClone.documentElement
        );
        documentClone.close();
    });
};
