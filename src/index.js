/* @flow */
'use strict';

import {NodeParser} from './NodeParser';
import CanvasRenderer from './CanvasRenderer';
import Logger from './Logger';
import ImageLoader from './ImageLoader';
import {Bounds} from './Bounds';
import {cloneWindow} from './Clone';
import Color from './Color';

export type Options = {
    async: boolean,
    imageTimeout: number,
    proxy: string,
    canvas: HTMLCanvasElement,
    allowTaint: true,
    type: string
};

const html2canvas = (element: HTMLElement, options: Options): Promise<HTMLCanvasElement> => {
    const logger = new Logger();

    const ownerDocument = element.ownerDocument;
    const defaultView = ownerDocument.defaultView;
    const windowBounds = new Bounds(
        defaultView.pageXOffset,
        defaultView.pageYOffset,
        defaultView.innerWidth,
        defaultView.innerHeight
    );

    return cloneWindow(
        ownerDocument,
        ownerDocument,
        windowBounds,
        element,
        options
    ).then(([container, clonedElement]) => {
        if (__DEV__) {
            logger.log(`Document cloned`);
        }

        const imageLoader = new ImageLoader(options, logger);
        const stack = NodeParser(clonedElement, imageLoader, logger);
        const canvas = ownerDocument.createElement('canvas');
        const scale = defaultView.devicePixelRatio;
        const width = window.innerWidth;
        const height = window.innerHeight;
        canvas.width = Math.floor(width * scale);
        canvas.height = Math.floor(height * scale);
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;

        // http://www.w3.org/TR/css3-background/#special-backgrounds
        const backgroundColor =
            clonedElement === ownerDocument.documentElement
                ? stack.container.style.background.backgroundColor.isTransparent()
                  ? ownerDocument.body instanceof HTMLElement
                    ? new Color(getComputedStyle(ownerDocument.body).backgroundColor)
                    : null
                  : stack.container.style.background.backgroundColor
                : null;

        return imageLoader.ready().then(imageStore => {
            if (container.parentNode) {
                container.parentNode.removeChild(container);
            } else if (__DEV__) {
                logger.log(`Cannot detach cloned iframe as it is not in the DOM anymore`);
            }

            const renderer = new CanvasRenderer(canvas, {scale, backgroundColor, imageStore});
            return renderer.render(stack);
        });
    });
};

module.exports = html2canvas;
