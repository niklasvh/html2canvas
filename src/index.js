/* @flow */
'use strict';

import type {RenderTarget} from './Renderer';

import CanvasRenderer from './renderer/CanvasRenderer';
import Logger from './Logger';
import {renderElement} from './Window';

export type Options = {
    async: ?boolean,
    allowTaint: ?boolean,
    backgroundColor: string,
    canvas: ?HTMLCanvasElement,
    imageTimeout: number,
    proxy: ?string,
    removeContainer: ?boolean,
    scale: number,
    target: RenderTarget<*>,
    type: ?string,
    windowWidth: number,
    windowHeight: number,
    offsetX: number,
    offsetY: number
};

const html2canvas = (element: HTMLElement, conf: ?Options): Promise<*> => {
    if (typeof console === 'object' && typeof console.log === 'function') {
        console.log(`html2canvas ${__VERSION__}`);
    }

    const config = conf || {};
    const logger = new Logger();

    const ownerDocument = element.ownerDocument;
    const defaultView = ownerDocument.defaultView;

    const defaultOptions = {
        async: true,
        allowTaint: false,
        imageTimeout: 15000,
        proxy: null,
        removeContainer: true,
        scale: defaultView.devicePixelRatio || 1,
        target: new CanvasRenderer(config.canvas),
        type: null,
        windowWidth: defaultView.innerWidth,
        windowHeight: defaultView.innerHeight,
        offsetX: defaultView.pageXOffset,
        offsetY: defaultView.pageYOffset
    };

    const result = renderElement(element, {...defaultOptions, ...config}, logger);

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
