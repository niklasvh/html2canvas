/* @flow */
'use strict';
import type {Bounds} from './Bounds';
import type {Options} from './index';
import type {PseudoContentData, PseudoContentItem} from './PseudoNodeContent';
import type Logger from './Logger';

import {parseBounds} from './Bounds';
import {Proxy} from './Proxy';
import ResourceLoader from './ResourceLoader';
import {copyCSSStyles} from './Util';
import {parseBackgroundImage} from './parsing/background';
import CanvasRenderer from './renderer/CanvasRenderer';
import {
    parseCounterReset,
    popCounters,
    resolvePseudoContent,
    PSEUDO_CONTENT_ITEM_TYPE
} from './PseudoNodeContent';

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
    pseudoContentData: PseudoContentData;

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
        this.pseudoContentData = {
            counters: {},
            quoteDepth: 0
        };
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

        if (node instanceof HTMLStyleElement && node.sheet && node.sheet.cssRules) {
            const css = [].slice.call(node.sheet.cssRules, 0).reduce((css, rule) => {
                try {
                    if (rule && rule.cssText) {
                        return css + rule.cssText;
                    }
                    return css;
                } catch (err) {
                    this.logger.log('Unable to access cssText property', rule.name);
                    return css;
                }
            }, '');
            const style = node.cloneNode(false);
            style.textContent = css;
            return style;
        }

        return node.cloneNode(false);
    }

    cloneNode(node: Node): Node {
        const clone =
            node.nodeType === Node.TEXT_NODE
                ? document.createTextNode(node.nodeValue)
                : this.createElementClone(node);

        const window = node.ownerDocument.defaultView;
        const style = node instanceof window.HTMLElement ? window.getComputedStyle(node) : null;
        const styleBefore =
            node instanceof window.HTMLElement ? window.getComputedStyle(node, ':before') : null;
        const styleAfter =
            node instanceof window.HTMLElement ? window.getComputedStyle(node, ':after') : null;

        if (this.referenceElement === node && clone instanceof window.HTMLElement) {
            this.clonedReferenceElement = clone;
        }

        if (clone instanceof window.HTMLBodyElement) {
            createPseudoHideStyles(clone);
        }

        const counters = parseCounterReset(style, this.pseudoContentData);
        const contentBefore = resolvePseudoContent(node, styleBefore, this.pseudoContentData);

        for (let child = node.firstChild; child; child = child.nextSibling) {
            if (
                child.nodeType !== Node.ELEMENT_NODE ||
                (child.nodeName !== 'SCRIPT' &&
                    // $FlowFixMe
                    !child.hasAttribute(IGNORE_ATTRIBUTE) &&
                    (typeof this.options.ignoreElements !== 'function' ||
                        // $FlowFixMe
                        !this.options.ignoreElements(child)))
            ) {
                if (!this.copyStyles || child.nodeName !== 'STYLE') {
                    clone.appendChild(this.cloneNode(child));
                }
            }
        }

        const contentAfter = resolvePseudoContent(node, styleAfter, this.pseudoContentData);
        popCounters(counters, this.pseudoContentData);

        if (node instanceof window.HTMLElement && clone instanceof window.HTMLElement) {
            if (styleBefore) {
                this.inlineAllImages(
                    inlinePseudoElement(node, clone, styleBefore, contentBefore, PSEUDO_BEFORE)
                );
            }
            if (styleAfter) {
                this.inlineAllImages(
                    inlinePseudoElement(node, clone, styleAfter, contentAfter, PSEUDO_AFTER)
                );
            }
            if (style && this.copyStyles && !(node instanceof HTMLIFrameElement)) {
                copyCSSStyles(style, clone);
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
            const ctx = canvas.getContext('2d');
            const clonedCtx = clonedCanvas.getContext('2d');
            if (ctx) {
                clonedCtx.putImageData(ctx.getImageData(0, 0, canvas.width, canvas.height), 0, 0);
            } else {
                clonedCtx.drawImage(canvas, 0, 0);
            }
        }
    } catch (e) {}
};

const inlinePseudoElement = (
    node: HTMLElement,
    clone: HTMLElement,
    style: CSSStyleDeclaration,
    contentItems: ?Array<PseudoContentItem>,
    pseudoElt: ':before' | ':after'
): ?HTMLElement => {
    if (
        !style ||
        !style.content ||
        style.content === 'none' ||
        style.content === '-moz-alt-content' ||
        style.display === 'none'
    ) {
        return;
    }

    const anonymousReplacedElement = clone.ownerDocument.createElement('html2canvaspseudoelement');
    copyCSSStyles(style, anonymousReplacedElement);

    if (contentItems) {
        const len = contentItems.length;
        for (var i = 0; i < len; i++) {
            const item = contentItems[i];
            switch (item.type) {
                case PSEUDO_CONTENT_ITEM_TYPE.IMAGE:
                    const img = clone.ownerDocument.createElement('img');
                    img.src = parseBackgroundImage(`url(${item.value})`)[0].args[0];
                    img.style.opacity = '1';
                    anonymousReplacedElement.appendChild(img);
                    break;
                case PSEUDO_CONTENT_ITEM_TYPE.TEXT:
                    anonymousReplacedElement.appendChild(
                        clone.ownerDocument.createTextNode(item.value)
                    );
                    break;
            }
        }
    }

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

            const result = Promise.resolve([
                cloneIframeContainer,
                cloner.clonedReferenceElement,
                cloner.resourceLoader
            ]);

            const onclone = options.onclone;

            return cloner.clonedReferenceElement instanceof cloneWindow.HTMLElement ||
            cloner.clonedReferenceElement instanceof ownerDocument.defaultView.HTMLElement ||
            cloner.clonedReferenceElement instanceof HTMLElement
                ? typeof onclone === 'function'
                  ? Promise.resolve().then(() => onclone(documentClone)).then(() => result)
                  : result
                : Promise.reject(
                      __DEV__
                          ? `Error finding the ${referenceElement.nodeName} in the cloned document`
                          : ''
                  );
        });

        documentClone.open();
        documentClone.write(`${serializeDoctype(document.doctype)}<html></html>`);
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

const serializeDoctype = (doctype: ?DocumentType): string => {
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
