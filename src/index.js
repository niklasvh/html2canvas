/* @flow */
'use strict';

import type {RenderTarget} from './Renderer';

import {NodeParser} from './NodeParser';
import Renderer from './Renderer';
import CanvasRenderer from './renderer/CanvasRenderer';
import Logger from './Logger';
import ImageLoader from './ImageLoader';
import {Bounds, parseDocumentSize} from './Bounds';
import {cloneWindow} from './Clone';
import Color from './Color';
import {FontMetrics} from './Font';

export type Options = {
    async: ?boolean,
    allowTaint: ?boolean,
    canvas: ?HTMLCanvasElement,
    imageTimeout: ?number,
    proxy: ?string,
    removeContainer: ?boolean,
    scale: number,
    target: RenderTarget<*> | Array<RenderTarget<*>>,
    type: ?string,
    windowWidth: number,
    windowHeight: number
};

const html2canvas = (element: HTMLElement, config: Options): Promise<*> => {
    if (typeof console === 'object' && typeof console.log === 'function') {
        console.log(`html2canvas ${__VERSION__}`);
    }

    const logger = new Logger();

    const ownerDocument = element.ownerDocument;
    const defaultView = ownerDocument.defaultView;

    const defaultOptions = {
        async: true,
        allowTaint: false,
        imageTimeout: 10000,
        proxy: null,
        removeContainer: true,
        scale: defaultView.devicePixelRatio || 1,
        target: new CanvasRenderer(config.canvas),
        type: null,
        windowWidth: defaultView.innerWidth,
        windowHeight: defaultView.innerHeight
    };

    const options = {...defaultOptions, ...config};

    const windowBounds = new Bounds(
        defaultView.pageXOffset,
        defaultView.pageYOffset,
        options.windowWidth,
        options.windowHeight
    );

    const result = cloneWindow(
        ownerDocument,
        ownerDocument,
        windowBounds,
        element,
        options
    ).then(([container, clonedElement]) => {
        if (__DEV__) {
            logger.log(`Document cloned`);
        }

        const imageLoader = new ImageLoader(
            options,
            logger,
            clonedElement.ownerDocument.defaultView
        );
        const stack = NodeParser(clonedElement, imageLoader, logger);
        const clonedDocument = clonedElement.ownerDocument;
        const size = options.type === 'view' ? windowBounds : parseDocumentSize(clonedDocument);
        const width = size.width;
        const height = size.height;

        // http://www.w3.org/TR/css3-background/#special-backgrounds
        const backgroundColor =
            clonedElement === clonedDocument.documentElement
                ? stack.container.style.background.backgroundColor.isTransparent()
                  ? clonedDocument.body
                    ? new Color(getComputedStyle(clonedDocument.body).backgroundColor)
                    : null
                  : stack.container.style.background.backgroundColor
                : null;

        return imageLoader.ready().then(imageStore => {
            if (options.removeContainer === true) {
                if (container.parentNode) {
                    container.parentNode.removeChild(container);
                } else if (__DEV__) {
                    logger.log(`Cannot detach cloned iframe as it is not in the DOM anymore`);
                }
            }

            const fontMetrics = new FontMetrics(clonedDocument);
            if (__DEV__) {
                logger.log(`Starting renderer`);
            }

            const renderOptions = {
                backgroundColor,
                fontMetrics,
                imageStore,
                logger,
                scale: options.scale,
                width,
                height
            };

            if (Array.isArray(options.target)) {
                return Promise.all(
                    options.target.map(target => {
                        const renderer = new Renderer(target, renderOptions);
                        return renderer.render(stack);
                    })
                );
            } else {
                const renderer = new Renderer(options.target, renderOptions);
                return renderer.render(stack);
            }
        });
    });

    if (__DEV__) {
        return result.catch(e => {
            logger.error(e);
            throw e;
        });
    }
    return result;
};

html2canvas.CanvasRenderer = CanvasRenderer;

module.exports = html2canvas;
