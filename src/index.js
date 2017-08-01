/* @flow */
'use strict';

import {NodeParser} from './NodeParser';
import CanvasRenderer from './CanvasRenderer';
import Logger from './Logger';
import ImageLoader from './ImageLoader';
import Color from './Color';

export type Options = {
    async: boolean,
    imageTimeout: number,
    proxy: string,
    canvas: HTMLCanvasElement,
    allowTaint: true
};

const html2canvas = (element: HTMLElement, options: Options): Promise<HTMLCanvasElement> => {
    const logger = new Logger();
    const imageLoader = new ImageLoader(options, logger);
    const stack = NodeParser(element, imageLoader, logger);
    const canvas = document.createElement('canvas');

    const scale = window.devicePixelRatio;
    const width = window.innerWidth;
    const height = window.innerHeight;
    canvas.width = Math.floor(width * scale);
    canvas.height = Math.floor(height * scale);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    // http://www.w3.org/TR/css3-background/#special-backgrounds
    const backgroundColor =
        element === element.ownerDocument.documentElement
            ? stack.container.style.background.backgroundColor.isTransparent()
              ? element.ownerDocument.body instanceof HTMLElement
                ? new Color(getComputedStyle(element.ownerDocument.body).backgroundColor)
                : null
              : stack.container.style.background.backgroundColor
            : null;

    return imageLoader.ready().then(imageStore => {
        const renderer = new CanvasRenderer(canvas, {scale, backgroundColor, imageStore});
        return renderer.render(stack);
    });
};

module.exports = html2canvas;
