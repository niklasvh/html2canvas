/* @flow */
'use strict';

import type {RenderTarget, RenderOptions} from '../Renderer';
import type Color from '../Color';
import type {Path} from '../drawing/Path';
import type Size from '../drawing/Size';

import type {Font} from '../parsing/font';
import type {TextDecoration} from '../parsing/textDecoration';
import type {TextShadow} from '../parsing/textShadow';
import type {Matrix} from '../parsing/transform';

import type {Bounds} from '../Bounds';
import type {ImageElement} from '../ResourceLoader';
import type {LinearGradient, RadialGradient} from '../Gradient';
import type {TextBounds} from '../TextBounds';

import {PATH} from '../drawing/Path';
import {TEXT_DECORATION_LINE} from '../parsing/textDecoration';

const addColorStops = (
    gradient: LinearGradient | RadialGradient,
    canvasGradient: CanvasGradient
): void => {
    const maxStop = Math.max.apply(null, gradient.colorStops.map(colorStop => colorStop.stop));
    const f = 1 / Math.max(1, maxStop);
    gradient.colorStops.forEach(colorStop => {
        canvasGradient.addColorStop(f * colorStop.stop, colorStop.color.toString());
    });
};

export default class CanvasRenderer implements RenderTarget<HTMLCanvasElement> {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    options: RenderOptions;

    constructor(canvas: ?HTMLCanvasElement) {
        this.canvas = canvas ? canvas : document.createElement('canvas');
    }

    render(options: RenderOptions) {
        this.ctx = this.canvas.getContext('2d');
        this.options = options;
        this.canvas.width = Math.floor(options.width * options.scale);
        this.canvas.height = Math.floor(options.height * options.scale);
        this.canvas.style.width = `${options.width}px`;
        this.canvas.style.height = `${options.height}px`;

        this.ctx.scale(this.options.scale, this.options.scale);
        this.ctx.translate(-options.x, -options.y);
        this.ctx.textBaseline = 'bottom';
        options.logger.log(
            `Canvas renderer initialized (${options.width}x${options.height} at ${options.x},${options.y}) with scale ${this
                .options.scale}`
        );
    }

    clip(clipPaths: Array<Path>, callback: () => void) {
        if (clipPaths.length) {
            this.ctx.save();
            clipPaths.forEach(path => {
                this.path(path);
                this.ctx.clip();
            });
        }

        callback();

        if (clipPaths.length) {
            this.ctx.restore();
        }
    }

    drawImage(image: ImageElement, source: Bounds, destination: Bounds) {
        this.ctx.drawImage(
            image,
            source.left,
            source.top,
            source.width,
            source.height,
            destination.left,
            destination.top,
            destination.width,
            destination.height
        );
    }

    drawShape(path: Path, color: Color) {
        this.path(path);
        this.ctx.fillStyle = color.toString();
        this.ctx.fill();
    }

    fill(color: Color) {
        this.ctx.fillStyle = color.toString();
        this.ctx.fill();
    }

    getTarget(): Promise<HTMLCanvasElement> {
        this.canvas.getContext('2d').setTransform(1, 0, 0, 1, 0, 0);
        return Promise.resolve(this.canvas);
    }

    path(path: Path) {
        this.ctx.beginPath();
        if (Array.isArray(path)) {
            path.forEach((point, index) => {
                const start = point.type === PATH.VECTOR ? point : point.start;
                if (index === 0) {
                    this.ctx.moveTo(start.x, start.y);
                } else {
                    this.ctx.lineTo(start.x, start.y);
                }

                if (point.type === PATH.BEZIER_CURVE) {
                    this.ctx.bezierCurveTo(
                        point.startControl.x,
                        point.startControl.y,
                        point.endControl.x,
                        point.endControl.y,
                        point.end.x,
                        point.end.y
                    );
                }
            });
        } else {
            this.ctx.arc(
                path.x + path.radius,
                path.y + path.radius,
                path.radius,
                0,
                Math.PI * 2,
                true
            );
        }

        this.ctx.closePath();
    }

    rectangle(x: number, y: number, width: number, height: number, color: Color) {
        this.ctx.fillStyle = color.toString();
        this.ctx.fillRect(x, y, width, height);
    }

    renderLinearGradient(bounds: Bounds, gradient: LinearGradient) {
        const linearGradient = this.ctx.createLinearGradient(
            bounds.left + gradient.direction.x1,
            bounds.top + gradient.direction.y1,
            bounds.left + gradient.direction.x0,
            bounds.top + gradient.direction.y0
        );

        addColorStops(gradient, linearGradient);
        this.ctx.fillStyle = linearGradient;
        this.ctx.fillRect(bounds.left, bounds.top, bounds.width, bounds.height);
    }

    renderRadialGradient(bounds: Bounds, gradient: RadialGradient) {
        const x = bounds.left + gradient.center.x;
        const y = bounds.top + gradient.center.y;

        const radialGradient = this.ctx.createRadialGradient(x, y, 0, x, y, gradient.radius.x);
        if (!radialGradient) {
            return;
        }

        addColorStops(gradient, radialGradient);
        this.ctx.fillStyle = radialGradient;

        if (gradient.radius.x !== gradient.radius.y) {
            // transforms for elliptical radial gradient
            const midX = bounds.left + 0.5 * bounds.width;
            const midY = bounds.top + 0.5 * bounds.height;
            const f = gradient.radius.y / gradient.radius.x;
            const invF = 1 / f;

            this.transform(midX, midY, [1, 0, 0, f, 0, 0], () =>
                this.ctx.fillRect(
                    bounds.left,
                    invF * (bounds.top - midY) + midY,
                    bounds.width,
                    bounds.height * invF
                )
            );
        } else {
            this.ctx.fillRect(bounds.left, bounds.top, bounds.width, bounds.height);
        }
    }

    renderRepeat(
        path: Path,
        image: ImageElement,
        imageSize: Size,
        offsetX: number,
        offsetY: number
    ) {
        this.path(path);
        this.ctx.fillStyle = this.ctx.createPattern(this.resizeImage(image, imageSize), 'repeat');
        this.ctx.translate(offsetX, offsetY);
        this.ctx.fill();
        this.ctx.translate(-offsetX, -offsetY);
    }

    renderTextNode(
        textBounds: Array<TextBounds>,
        color: Color,
        font: Font,
        textDecoration: TextDecoration | null,
        textShadows: Array<TextShadow> | null
    ) {
        this.ctx.font = [
            font.fontStyle,
            font.fontVariant,
            font.fontWeight,
            font.fontSize,
            font.fontFamily
        ].join(' ');

        textBounds.forEach(text => {
            this.ctx.fillStyle = color.toString();
            if (textShadows && text.text.trim().length) {
                textShadows.slice(0).reverse().forEach(textShadow => {
                    this.ctx.shadowColor = textShadow.color.toString();
                    this.ctx.shadowOffsetX = textShadow.offsetX * this.options.scale;
                    this.ctx.shadowOffsetY = textShadow.offsetY * this.options.scale;
                    this.ctx.shadowBlur = textShadow.blur;

                    this.ctx.fillText(
                        text.text,
                        text.bounds.left,
                        text.bounds.top + text.bounds.height
                    );
                });
            } else {
                this.ctx.fillText(
                    text.text,
                    text.bounds.left,
                    text.bounds.top + text.bounds.height
                );
            }

            if (textDecoration !== null) {
                const textDecorationColor = textDecoration.textDecorationColor || color;
                textDecoration.textDecorationLine.forEach(textDecorationLine => {
                    switch (textDecorationLine) {
                        case TEXT_DECORATION_LINE.UNDERLINE:
                            // Draws a line at the baseline of the font
                            // TODO As some browsers display the line as more than 1px if the font-size is big,
                            // need to take that into account both in position and size
                            const {baseline} = this.options.fontMetrics.getMetrics(font);
                            this.rectangle(
                                text.bounds.left,
                                Math.round(text.bounds.top + baseline),
                                text.bounds.width,
                                1,
                                textDecorationColor
                            );
                            break;
                        case TEXT_DECORATION_LINE.OVERLINE:
                            this.rectangle(
                                text.bounds.left,
                                Math.round(text.bounds.top),
                                text.bounds.width,
                                1,
                                textDecorationColor
                            );
                            break;
                        case TEXT_DECORATION_LINE.LINE_THROUGH:
                            // TODO try and find exact position for line-through
                            const {middle} = this.options.fontMetrics.getMetrics(font);
                            this.rectangle(
                                text.bounds.left,
                                Math.ceil(text.bounds.top + middle),
                                text.bounds.width,
                                1,
                                textDecorationColor
                            );
                            break;
                    }
                });
            }
        });
    }

    resizeImage(image: ImageElement, size: Size): ImageElement {
        if (image.width === size.width && image.height === size.height) {
            return image;
        }

        const canvas = this.canvas.ownerDocument.createElement('canvas');
        canvas.width = size.width;
        canvas.height = size.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(image, 0, 0, image.width, image.height, 0, 0, size.width, size.height);
        return canvas;
    }

    setOpacity(opacity: number) {
        this.ctx.globalAlpha = opacity;
    }

    transform(offsetX: number, offsetY: number, matrix: Matrix, callback: () => void) {
        this.ctx.save();
        this.ctx.translate(offsetX, offsetY);
        this.ctx.transform(matrix[0], matrix[1], matrix[2], matrix[3], matrix[4], matrix[5]);
        this.ctx.translate(-offsetX, -offsetY);

        callback();

        this.ctx.restore();
    }
}
