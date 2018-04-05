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
    foreignObjectRendering: boolean,
    ignoreElements?: HTMLElement => boolean,
    imageTimeout: number,
    logging: boolean,
    onclone?: Document => void,
    proxy: ?string,
    removeContainer: ?boolean,
    scale: number,
    target: RenderTarget<*>,
    useCORS: boolean,
    width: number,
    height: number,
    x: number,
    y: number,
    scrollX: number,
    scrollY: number,
    windowWidth: number,
    windowHeight: number
};

const html2canvas = (element: HTMLElement, conf: ?Options): Promise<*> => {
    const config = conf || {};
    const logger = new Logger(typeof config.logging === 'boolean' ? config.logging : true);
    logger.log(`html2canvas ${__VERSION__}`);

    if (__DEV__ && typeof config.onrendered === 'function') {
        logger.error(
            `onrendered option is deprecated, html2canvas returns a Promise with the canvas as the value`
        );
    }

    const ownerDocument = element.ownerDocument;
    if (!ownerDocument) {
        return Promise.reject(`Provided element is not within a Document`);
    }
    const defaultView = ownerDocument.defaultView;

    const defaultOptions = {
        async: true,
        allowTaint: false,
        backgroundColor: '#ffffff',
        imageTimeout: 15000,
        logging: true,
        proxy: null,
        removeContainer: true,
        foreignObjectRendering: false,
        scale: defaultView.devicePixelRatio || 1,
        target: new CanvasRenderer(config.canvas),
        useCORS: false,
        windowWidth: defaultView.innerWidth,
        windowHeight: defaultView.innerHeight,
        scrollX: defaultView.pageXOffset,
        scrollY: defaultView.pageYOffset
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
