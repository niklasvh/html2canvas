/* @flow */
'use strict';
import {parse} from 'url';

import type {RenderTarget, RenderOptions} from '../Renderer';
import type Color from '../Color';
import type {Path} from '../drawing/Path';
import type Size from '../drawing/Size';

import type {Font} from '../parsing/font';
import type {
    TextDecoration,
    TextDecorationStyle,
    TextDecorationLine
} from '../parsing/textDecoration';
import type {TextShadow} from '../parsing/textShadow';
import type {Matrix} from '../parsing/transform';

import type {Bounds} from '../Bounds';
import type {ImageElement} from '../ResourceLoader';
import type {LinearGradient, RadialGradient} from '../Gradient';
import type {TextBounds} from '../TextBounds';

import {TEXT_DECORATION_STYLE, TEXT_DECORATION_LINE} from '../parsing/textDecoration';
import {PATH} from '../drawing/Path';

class RefTestRenderer implements RenderTarget<string> {
    options: RenderOptions;
    indent: number;
    lines: Array<string>;

    render(options: RenderOptions) {
        this.options = options;
        this.indent = 0;
        this.lines = [];
        options.logger.log(`RefTest renderer initialized`);
        this.writeLine(`Window: [${options.width}, ${options.height}]`);
    }

    clip(clipPaths: Array<Path>, callback: () => void) {
        this.writeLine(`Clip: ${clipPaths.map(this.formatPath, this).join(' | ')}`);
        this.indent += 2;
        callback();
        this.indent -= 2;
    }

    drawImage(image: ImageElement, source: Bounds, destination: Bounds) {
        this.writeLine(
            `Draw image: ${this.formatImage(image)} (source: ${this.formatBounds(
                source
            )}) (destination: ${this.formatBounds(source)})`
        );
    }

    drawShape(path: Path, color: Color) {
        this.writeLine(`Shape: ${color.toString()} ${this.formatPath(path)}`);
    }

    fill(color: Color) {
        this.writeLine(`Fill: ${color.toString()}`);
    }

    getTarget(): Promise<string> {
        return Promise.resolve(this.lines.join('\n'));
    }

    rectangle(x: number, y: number, width: number, height: number, color: Color) {
        const list = [x, y, width, height].map(v => Math.round(v)).join(', ');
        this.writeLine(`Rectangle: [${list}] ${color.toString()}`);
    }

    formatBounds(bounds: Bounds): string {
        const list = [bounds.left, bounds.top, bounds.width, bounds.height];
        return `[${list.map(v => Math.round(v)).join(', ')}]`;
    }

    formatImage(image: ImageElement): string {
        return image.tagName === 'CANVAS'
            ? 'Canvas'
            : // $FlowFixMe
              `Image ("${parse(image.src).pathname.substring(0, 100)}")`;
    }

    formatPath(path: Path): string {
        if (!Array.isArray(path)) {
            return `Circle(x: ${Math.round(path.x)}, y: ${Math.round(path.y)}, r: ${Math.round(
                path.radius
            )})`;
        }
        const string = path
            .map(v => {
                if (v.type === PATH.VECTOR) {
                    return `Vector(x: ${Math.round(v.x)}, y: ${Math.round(v.y)})`;
                }
                if (v.type === PATH.BEZIER_CURVE) {
                    const values = [
                        `x0: ${Math.round(v.start.x)}`,
                        `y0: ${Math.round(v.start.y)}`,
                        `x1: ${Math.round(v.end.x)}`,
                        `y1: ${Math.round(v.end.y)}`,
                        `cx0: ${Math.round(v.startControl.x)}`,
                        `cy0: ${Math.round(v.startControl.y)}`,
                        `cx1: ${Math.round(v.endControl.x)}`,
                        `cy1: ${Math.round(v.endControl.y)}`
                    ];
                    return `BezierCurve(${values.join(', ')})`;
                }
            })
            .join(' > ');
        return `Path (${string})`;
    }

    renderLinearGradient(bounds: Bounds, gradient: LinearGradient) {
        const direction = [
            `x0: ${Math.round(gradient.direction.x0)}`,
            `x1: ${Math.round(gradient.direction.x1)}`,
            `y0: ${Math.round(gradient.direction.y0)}`,
            `y1: ${Math.round(gradient.direction.y1)}`
        ];

        const stops = gradient.colorStops.map(
            stop => `${stop.color.toString()} ${Math.ceil(stop.stop * 100) / 100}`
        );

        this.writeLine(
            `Gradient: ${this.formatBounds(bounds)} linear-gradient(${direction.join(
                ', '
            )} ${stops.join(', ')})`
        );
    }

    renderRadialGradient(bounds: Bounds, gradient: RadialGradient) {
        const stops = gradient.colorStops.map(
            stop => `${stop.color.toString()} ${Math.ceil(stop.stop * 100) / 100}`
        );

        this.writeLine(
            `RadialGradient: ${this.formatBounds(bounds)} radial-gradient(${gradient.radius
                .x} ${gradient.radius.y} at ${gradient.center.x} ${gradient.center.y}, ${stops.join(
                ', '
            )})`
        );
    }

    renderRepeat(
        path: Path,
        image: ImageElement,
        imageSize: Size,
        offsetX: number,
        offsetY: number
    ) {
        this.writeLine(
            `Repeat: ${this.formatImage(image)} [${Math.round(offsetX)}, ${Math.round(
                offsetY
            )}] Size (${Math.round(imageSize.width)}, ${Math.round(
                imageSize.height
            )}) ${this.formatPath(path)}`
        );
    }

    renderTextNode(
        textBounds: Array<TextBounds>,
        color: Color,
        font: Font,
        textDecoration: TextDecoration | null,
        textShadows: Array<TextShadow> | null
    ) {
        const fontString = [
            font.fontStyle,
            font.fontVariant,
            font.fontWeight,
            parseInt(font.fontSize, 10),
            font.fontFamily.replace(/"/g, '')
        ]
            .join(' ')
            .split(',')[0];

        const textDecorationString = this.textDecoration(textDecoration, color);
        const shadowString = textShadows
            ? ` Shadows: (${textShadows
                  .map(
                      shadow =>
                          `${shadow.color.toString()} ${shadow.offsetX}px ${shadow.offsetY}px ${shadow.blur}px`
                  )
                  .join(', ')})`
            : '';

        this.writeLine(
            `Text: ${color.toString()} ${fontString}${shadowString}${textDecorationString}`
        );

        this.indent += 2;
        textBounds.forEach(textBound => {
            this.writeLine(
                `[${Math.round(textBound.bounds.left)}, ${Math.round(
                    textBound.bounds.top
                )}]: ${textBound.text}`
            );
        });
        this.indent -= 2;
    }

    textDecoration(textDecoration: TextDecoration | null, color: Color): string {
        if (textDecoration) {
            const textDecorationColor = (textDecoration.textDecorationColor
                ? textDecoration.textDecorationColor
                : color).toString();
            const textDecorationLines = textDecoration.textDecorationLine.map(
                this.textDecorationLine,
                this
            );
            return textDecoration
                ? ` ${this.textDecorationStyle(
                      textDecoration.textDecorationStyle
                  )} ${textDecorationColor} ${textDecorationLines.join(', ')}`
                : '';
        }

        return '';
    }

    textDecorationLine(textDecorationLine: TextDecorationLine): string {
        switch (textDecorationLine) {
            case TEXT_DECORATION_LINE.LINE_THROUGH:
                return 'line-through';
            case TEXT_DECORATION_LINE.OVERLINE:
                return 'overline';
            case TEXT_DECORATION_LINE.UNDERLINE:
                return 'underline';
            case TEXT_DECORATION_LINE.BLINK:
                return 'blink';
        }
        return 'UNKNOWN';
    }

    textDecorationStyle(textDecorationStyle: TextDecorationStyle): string {
        switch (textDecorationStyle) {
            case TEXT_DECORATION_STYLE.SOLID:
                return 'solid';
            case TEXT_DECORATION_STYLE.DOTTED:
                return 'dotted';
            case TEXT_DECORATION_STYLE.DOUBLE:
                return 'double';
            case TEXT_DECORATION_STYLE.DASHED:
                return 'dashed';
            case TEXT_DECORATION_STYLE.WAVY:
                return 'WAVY';
        }
        return 'UNKNOWN';
    }

    setOpacity(opacity: number) {
        this.writeLine(`Opacity: ${opacity}`);
    }

    transform(offsetX: number, offsetY: number, matrix: Matrix, callback: () => void) {
        this.writeLine(
            `Transform: (${Math.round(offsetX)}, ${Math.round(offsetY)}) [${matrix
                .map(v => Math.round(v * 100) / 100)
                .join(', ')}]`
        );
        this.indent += 2;
        callback();
        this.indent -= 2;
    }

    writeLine(text: string) {
        this.lines.push(`${new Array(this.indent + 1).join(' ')}${text}`);
    }
}

module.exports = RefTestRenderer;
