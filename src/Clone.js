/* @flow */
'use strict';
import type {Bounds} from './Bounds';
import type {Options} from './index';
import type Logger from './Logger';

import {parseBounds} from './Bounds';
import {Proxy} from './Proxy';
import ResourceLoader from './ResourceLoader';
import {copyCSSStyles} from './Util';
import {parseBackgroundImage} from './parsing/background';
import CanvasRenderer from './renderer/CanvasRenderer';

const IGNORE_ATTRIBUTE = 'data-html2canvas-ignore';

export class DocumentCloner {
    scrolledElements: Array<[HTMLElement, number, number]>;
    referenceElement: HTMLElement;
    clonedReferenceElement: HTMLElement;
    documentElement: HTMLElement;
    resourceLoader: ResourceLoader;
    logger: Logger;
    options: Options;
    inlineImages: boolean;
    copyStyles: boolean;
    renderer: (element: HTMLElement, options: Options, logger: Logger) => Promise<*>;

    constructor(
        element: HTMLElement,
        options: Options,
        logger: Logger,
        copyInline: boolean,
        renderer: (element: HTMLElement, options: Options, logger: Logger) => Promise<*>
    ) {
        this.referenceElement = element;
        this.scrolledElements = [];
        this.copyStyles = copyInline;
        this.inlineImages = copyInline;
        this.logger = logger;
        this.options = options;
        this.renderer = renderer;
        this.resourceLoader = new ResourceLoader(options, logger, window);
        // $FlowFixMe
        this.documentElement = this.cloneNode(element.ownerDocument.documentElement);
    }

    inlineAllImages(node: ?HTMLElement) {
        if (this.inlineImages && node) {
            const style = node.style;
            Promise.all(
                parseBackgroundImage(style.backgroundImage).map(backgroundImage => {
                    if (backgroundImage.method === 'url') {
                        return this.resourceLoader
                            .inlineImage(backgroundImage.args[0])
                            .then(
                                img =>
                                    img && typeof img.src === 'string'
                                        ? `url("${img.src}")`
                                        : 'none'
                            )
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
                this.resourceLoader
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

    inlineFonts(document: Document): Promise<void> {
        return Promise.all(
            Array.from(document.styleSheets).map(sheet => {
                if (sheet.href) {
                    return fetch(sheet.href)
                        .then(res => res.text())
                        .then(text => createStyleSheetFontsFromText(text, sheet.href))
                        .catch(e => {
                            if (__DEV__) {
                                this.logger.log(`Unable to load stylesheet`, e);
                            }
                            return [];
                        });
                }
                return getSheetFonts(sheet, document);
            })
        )
            .then(fonts => fonts.reduce((acc, font) => acc.concat(font), []))
            .then(fonts =>
                Promise.all(
                    fonts.map(font =>
                        fetch(font.formats[0].src)
                            .then(response => response.blob())
                            .then(
                                blob =>
                                    new Promise((resolve, reject) => {
                                        const reader = new FileReader();
                                        reader.onerror = reject;
                                        reader.onload = () => {
                                            // $FlowFixMe
                                            const result: string = reader.result;
                                            resolve(result);
                                        };
                                        reader.readAsDataURL(blob);
                                    })
                            )
                            .then(dataUri => {
                                font.fontFace.setProperty('src', `url("${dataUri}")`);
                                return `@font-face {${font.fontFace.cssText} `;
                            })
                    )
                )
            )
            .then(fontCss => {
                const style = document.createElement('style');
                style.textContent = fontCss.join('\n');
                this.documentElement.appendChild(style);
            });
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

        if (node instanceof HTMLIFrameElement) {
            const tempIframe = node.cloneNode(false);
            const iframeKey = generateIframeKey();
            tempIframe.setAttribute('data-html2canvas-internal-iframe-key', iframeKey);

            const {width, height} = parseBounds(node, 0, 0);

            this.resourceLoader.cache[iframeKey] = getIframeDocumentElement(node, this.options)
                .then(documentElement => {
                    return this.renderer(
                        documentElement,
                        {
                            async: this.options.async,
                            allowTaint: this.options.allowTaint,
                            backgroundColor: '#ffffff',
                            canvas: null,
                            imageTimeout: this.options.imageTimeout,
                            proxy: this.options.proxy,
                            removeContainer: this.options.removeContainer,
                            scale: this.options.scale,
                            foreignObjectRendering: this.options.foreignObjectRendering,
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
                        this.logger.child(iframeKey)
                    );
                })
                .then(
                    canvas =>
                        new Promise((resolve, reject) => {
                            const iframeCanvas = document.createElement('img');
                            iframeCanvas.onload = () => resolve(canvas);
                            iframeCanvas.onerror = reject;
                            iframeCanvas.src = canvas.toDataURL();
                            if (tempIframe.parentNode) {
                                tempIframe.parentNode.replaceChild(
                                    copyCSSStyles(
                                        node.ownerDocument.defaultView.getComputedStyle(node),
                                        iframeCanvas
                                    ),
                                    tempIframe
                                );
                            }
                        })
                );
            return tempIframe;
        }

        return node.cloneNode(false);
    }

    cloneNode(node: Node): Node {
        const clone =
            node.nodeType === Node.TEXT_NODE
                ? document.createTextNode(node.nodeValue)
                : this.createElementClone(node);

        const window = node.ownerDocument.defaultView;

        if (this.referenceElement === node && clone instanceof window.HTMLElement) {
            this.clonedReferenceElement = clone;
        }

        if (clone instanceof window.HTMLBodyElement) {
            createPseudoHideStyles(clone);
        }

        for (let child = node.firstChild; child; child = child.nextSibling) {
            if (
                child.nodeType !== Node.ELEMENT_NODE ||
                // $FlowFixMe
                (child.nodeName !== 'SCRIPT' && !child.hasAttribute(IGNORE_ATTRIBUTE))
            ) {
                if (!this.copyStyles || child.nodeName !== 'STYLE') {
                    clone.appendChild(this.cloneNode(child));
                }
            }
        }
        if (node instanceof window.HTMLElement && clone instanceof window.HTMLElement) {
            this.inlineAllImages(inlinePseudoElement(node, clone, PSEUDO_BEFORE));
            this.inlineAllImages(inlinePseudoElement(node, clone, PSEUDO_AFTER));
            if (this.copyStyles && !(node instanceof HTMLIFrameElement)) {
                copyCSSStyles(node.ownerDocument.defaultView.getComputedStyle(node), clone);
            }
            this.inlineAllImages(clone);
            if (node.scrollTop !== 0 || node.scrollLeft !== 0) {
                this.scrolledElements.push([clone, node.scrollLeft, node.scrollTop]);
            }
            switch (node.nodeName) {
                case 'CANVAS':
                    if (!this.copyStyles) {
                        cloneCanvasContents(node, clone);
                    }
                    break;
                case 'TEXTAREA':
                case 'SELECT':
                    clone.value = node.value;
                    break;
            }
        }
        return clone;
    }
}

type Font = {
    src: string,
    format: string
};

type FontFamily = {
    formats: Array<Font>,
    fontFace: CSSStyleDeclaration
};

const getSheetFonts = (sheet: StyleSheet, document: Document): Array<FontFamily> => {
    // $FlowFixMe
    return (sheet.cssRules ? Array.from(sheet.cssRules) : [])
        .filter(rule => rule.type === CSSRule.FONT_FACE_RULE)
        .map(rule => {
            const src = parseBackgroundImage(rule.style.getPropertyValue('src'));
            const formats = [];
            for (let i = 0; i < src.length; i++) {
                if (src[i].method === 'url' && src[i + 1] && src[i + 1].method === 'format') {
                    const a = document.createElement('a');
                    a.href = src[i].args[0];
                    if (document.body) {
                        document.body.appendChild(a);
                    }

                    const font = {
                        src: a.href,
                        format: src[i + 1].args[0]
                    };
                    formats.push(font);
                }
            }

            return {
                // TODO select correct format for browser),

                formats: formats.filter(font => /^woff/i.test(font.format)),
                fontFace: rule.style
            };
        })
        .filter(font => font.formats.length);
};

const createStyleSheetFontsFromText = (text: string, baseHref: string): Array<FontFamily> => {
    const doc = document.implementation.createHTMLDocument('');
    const base = document.createElement('base');
    // $FlowFixMe
    base.href = baseHref;
    const style = document.createElement('style');

    style.textContent = text;
    if (doc.head) {
        doc.head.appendChild(base);
    }
    if (doc.body) {
        doc.body.appendChild(style);
    }

    return style.sheet ? getSheetFonts(style.sheet, doc) : [];
};

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

const generateIframeKey = (): string =>
    Math.ceil(Date.now() + Math.random() * 10000000).toString(16);

const DATA_URI_REGEXP = /^data:text\/(.+);(base64)?,(.*)$/i;

const getIframeDocumentElement = (
    node: HTMLIFrameElement,
    options: Options
): Promise<HTMLElement> => {
    try {
        return Promise.resolve(node.contentWindow.document.documentElement);
    } catch (e) {
        return options.proxy
            ? Proxy(node.src, options)
                  .then(html => {
                      const match = html.match(DATA_URI_REGEXP);
                      if (!match) {
                          return Promise.reject();
                      }

                      return match[2] === 'base64'
                          ? window.atob(decodeURIComponent(match[3]))
                          : decodeURIComponent(match[3]);
                  })
                  .then(html =>
                      createIframeContainer(
                          node.ownerDocument,
                          parseBounds(node, 0, 0)
                      ).then(cloneIframeContainer => {
                          const cloneWindow = cloneIframeContainer.contentWindow;
                          const documentClone = cloneWindow.document;

                          documentClone.open();
                          documentClone.write(html);
                          const iframeLoad = iframeLoader(cloneIframeContainer).then(
                              () => documentClone.documentElement
                          );

                          documentClone.close();
                          return iframeLoad;
                      })
                  )
            : Promise.reject();
    }
};

const createIframeContainer = (
    ownerDocument: Document,
    bounds: Bounds
): Promise<HTMLIFrameElement> => {
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
    if (!ownerDocument.body) {
        return Promise.reject(
            __DEV__ ? `Body element not found in Document that is getting rendered` : ''
        );
    }

    ownerDocument.body.appendChild(cloneIframeContainer);

    return Promise.resolve(cloneIframeContainer);
};

const iframeLoader = (cloneIframeContainer: HTMLIFrameElement): Promise<HTMLIFrameElement> => {
    const cloneWindow = cloneIframeContainer.contentWindow;
    const documentClone = cloneWindow.document;

    return new Promise((resolve, reject) => {
        cloneWindow.onload = cloneIframeContainer.onload = documentClone.onreadystatechange = () => {
            const interval = setInterval(() => {
                if (
                    documentClone.body.childNodes.length > 0 &&
                    documentClone.readyState === 'complete'
                ) {
                    clearInterval(interval);
                    resolve(cloneIframeContainer);
                }
            }, 50);
        };
    });
};

export const cloneWindow = (
    ownerDocument: Document,
    bounds: Bounds,
    referenceElement: HTMLElement,
    options: Options,
    logger: Logger,
    renderer: (element: HTMLElement, options: Options, logger: Logger) => Promise<*>
): Promise<[HTMLIFrameElement, HTMLElement, ResourceLoader]> => {
    const cloner = new DocumentCloner(referenceElement, options, logger, false, renderer);
    const scrollX = ownerDocument.defaultView.pageXOffset;
    const scrollY = ownerDocument.defaultView.pageYOffset;

    return createIframeContainer(ownerDocument, bounds).then(cloneIframeContainer => {
        const cloneWindow = cloneIframeContainer.contentWindow;
        const documentClone = cloneWindow.document;

        /* Chrome doesn't detect relative background-images assigned in inline <style> sheets when fetched through getComputedStyle
             if window url is about:blank, we can assign the url to current by writing onto the document
             */

        const iframeLoad = iframeLoader(cloneIframeContainer).then(() => {
            cloner.scrolledElements.forEach(initNode);
            cloneWindow.scrollTo(bounds.left, bounds.top);
            if (
                /(iPad|iPhone|iPod)/g.test(navigator.userAgent) &&
                (cloneWindow.scrollY !== bounds.top || cloneWindow.scrollX !== bounds.left)
            ) {
                documentClone.documentElement.style.top = -bounds.top + 'px';
                documentClone.documentElement.style.left = -bounds.left + 'px';
                documentClone.documentElement.style.position = 'absolute';
            }
            return cloner.clonedReferenceElement instanceof cloneWindow.HTMLElement ||
            cloner.clonedReferenceElement instanceof ownerDocument.defaultView.HTMLElement ||
            cloner.clonedReferenceElement instanceof HTMLElement
                ? Promise.resolve([
                      cloneIframeContainer,
                      cloner.clonedReferenceElement,
                      cloner.resourceLoader
                  ])
                : Promise.reject(
                      __DEV__
                          ? `Error finding the ${referenceElement.nodeName} in the cloned document`
                          : ''
                  );
        });

        documentClone.open();
        documentClone.write('<!DOCTYPE html><html></html>');
        // Chrome scrolls the parent document for some reason after the write to the cloned window???
        restoreOwnerScroll(referenceElement.ownerDocument, scrollX, scrollY);
        documentClone.replaceChild(
            documentClone.adoptNode(cloner.documentElement),
            documentClone.documentElement
        );
        documentClone.close();

        return iframeLoad;
    });
};
