/* @flow */
'use strict';
import type Color from './Color';
import type Size from './Size';
import type {Path, BoundCurves} from './Bounds';
import type {TextBounds} from './TextBounds';
import type {BackgroundImage} from './parsing/background';
import type {Border, BorderSide} from './parsing/border';

import Vector from './Vector';
import BezierCurve from './BezierCurve';

import type NodeContainer from './NodeContainer';
import type TextContainer from './TextContainer';
import type {ImageStore} from './ImageLoader';
import type StackingContext from './StackingContext';

import {
    BACKGROUND_ORIGIN,
    calculateBackgroungPaintingArea,
    calculateBackgroundPosition,
    calculateBackgroundRepeatPath,
    calculateBackgroundSize
} from './parsing/background';
import {BORDER_STYLE} from './parsing/border';
import {
    parsePathForBorder,
    calculateContentBox,
    calculatePaddingBox,
    calculatePaddingBoxPath
} from './Bounds';

export type RenderOptions = {
    scale: number,
    backgroundColor: ?Color,
    imageStore: ImageStore
};

export default class CanvasRenderer {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    options: RenderOptions;

    constructor(canvas: HTMLCanvasElement, options: RenderOptions) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.options = options;
    }

    renderNode(container: NodeContainer) {
        if (container.isVisible()) {
            this.renderNodeBackgroundAndBorders(container);
            this.renderNodeContent(container);
        }
    }

    renderNodeContent(container: NodeContainer) {
        this.ctx.save();
        const clipPaths = container.getClipPaths();
        if (clipPaths.length) {
            clipPaths.forEach(path => {
                this.path(path);
                this.ctx.clip();
            });
        }

        if (container.textNodes.length) {
            this.ctx.fillStyle = container.style.color.toString();
            this.ctx.font = [
                container.style.font.fontStyle,
                container.style.font.fontVariant,
                container.style.font.fontWeight,
                container.style.font.fontSize,
                container.style.font.fontFamily
            ]
                .join(' ')
                .split(',')[0];
            container.textNodes.forEach(this.renderTextNode, this);
        }

        if (container.image) {
            const image = this.options.imageStore.get(container.image);
            if (image) {
                const contentBox = calculateContentBox(
                    container.bounds,
                    container.style.padding,
                    container.style.border
                );
                const width = typeof image.width === 'number' ? image.width : contentBox.width;
                const height = typeof image.height === 'number' ? image.height : contentBox.height;

                this.ctx.drawImage(
                    image,
                    0,
                    0,
                    width,
                    height,
                    contentBox.left,
                    contentBox.top,
                    contentBox.width,
                    contentBox.height
                );
            }
        }

        this.ctx.restore();
    }

    renderNodeBackgroundAndBorders(container: NodeContainer) {
        this.ctx.save();
        if (container.parent) {
            const clipPaths = container.parent.getClipPaths();
            if (clipPaths.length) {
                clipPaths.forEach(path => {
                    this.path(path);
                    this.ctx.clip();
                });
            }
        }

        const backgroungPaintingArea = calculateBackgroungPaintingArea(
            container.curvedBounds,
            container.style.background.backgroundClip
        );
        this.path(backgroungPaintingArea);
        if (!container.style.background.backgroundColor.isTransparent()) {
            this.ctx.fillStyle = container.style.background.backgroundColor.toString();
            this.ctx.fill();
        }

        this.ctx.save();
        this.ctx.clip();
        this.renderBackgroundImage(container);
        this.ctx.restore();
        container.style.border.forEach((border, side) => {
            this.renderBorder(border, side, container.curvedBounds);
        });
        this.ctx.restore();
    }

    renderTextNode(textContainer: TextContainer) {
        textContainer.bounds.forEach(this.renderText, this);
    }

    renderText(text: TextBounds) {
        this.ctx.fillText(text.text, text.bounds.left, text.bounds.top + text.bounds.height);
    }

    renderBackgroundImage(container: NodeContainer) {
        container.style.background.backgroundImage.reverse().forEach(backgroundImage => {
            if (backgroundImage.source.method === 'url' && backgroundImage.source.args.length) {
                this.renderBackgroundRepeat(container, backgroundImage);
            }
        });
    }

    renderBackgroundRepeat(container: NodeContainer, background: BackgroundImage) {
        const image = this.options.imageStore.get(background.source.args[0]);
        if (image) {
            const bounds = container.bounds;
            const paddingBox = calculatePaddingBox(bounds, container.style.border);
            const backgroundImageSize = calculateBackgroundSize(background, image, bounds);

            // TODO support CONTENT_BOX
            const backgroundPositioningArea =
                container.style.background.backgroundOrigin === BACKGROUND_ORIGIN.BORDER_BOX
                    ? bounds
                    : paddingBox;

            const position = calculateBackgroundPosition(
                background.position,
                backgroundImageSize,
                backgroundPositioningArea
            );
            const path = calculateBackgroundRepeatPath(
                background,
                position,
                backgroundImageSize,
                backgroundPositioningArea,
                bounds
            );
            this.path(path);
            const offsetX = Math.round(paddingBox.left + position.x);
            const offsetY = Math.round(paddingBox.top + position.y);
            this.ctx.fillStyle = this.ctx.createPattern(
                this.resizeImage(image, backgroundImageSize),
                'repeat'
            );
            this.ctx.translate(offsetX, offsetY);
            this.ctx.fill();
            this.ctx.translate(-offsetX, -offsetY);
        }
    }

    resizeImage(image: HTMLImageElement, size: Size) {
        if (image.width === size.width && image.height === size.height) {
            return image;
        }

        const canvas = document.createElement('canvas');
        canvas.width = size.width;
        canvas.height = size.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(image, 0, 0, image.width, image.height, 0, 0, size.width, size.height);
        return canvas;
    }

    renderBorder(border: Border, side: BorderSide, curvePoints: BoundCurves) {
        if (border.borderStyle !== BORDER_STYLE.NONE && !border.borderColor.isTransparent()) {
            const path = parsePathForBorder(curvePoints, side);
            this.path(path);
            this.ctx.fillStyle = border.borderColor.toString();
            this.ctx.fill();
        }
    }

    path(path: Path) {
        this.ctx.beginPath();
        path.forEach((point, index) => {
            const start = point instanceof Vector ? point : point.start;
            if (index === 0) {
                this.ctx.moveTo(start.x, start.y);
            } else {
                this.ctx.lineTo(start.x, start.y);
            }

            if (point instanceof BezierCurve) {
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
        this.ctx.closePath();
    }

    rectangle(x: number, y: number, width: number, height: number, color: Color) {
        this.ctx.fillStyle = color.toString();
        this.ctx.fillRect(x, y, width, height);
    }

    renderStack(stack: StackingContext) {
        if (stack.container.isVisible()) {
            this.ctx.globalAlpha = stack.getOpacity();
            const transform = stack.container.style.transform;
            if (transform !== null) {
                this.ctx.save();
                this.ctx.translate(
                    stack.container.bounds.left + transform.transformOrigin[0].value,
                    stack.container.bounds.top + transform.transformOrigin[1].value
                );
                this.ctx.transform(
                    transform.transform[0],
                    transform.transform[1],
                    transform.transform[2],
                    transform.transform[3],
                    transform.transform[4],
                    transform.transform[5]
                );
                this.ctx.translate(
                    -(stack.container.bounds.left + transform.transformOrigin[0].value),
                    -(stack.container.bounds.top + transform.transformOrigin[1].value)
                );
            }
            const [
                negativeZIndex,
                zeroOrAutoZIndexOrTransformedOrOpacity,
                positiveZIndex,
                nonPositionedFloats,
                nonPositionedInlineLevel
            ] = splitStackingContexts(stack);
            const [inlineLevel, nonInlineLevel] = splitDescendants(stack);

            // https://www.w3.org/TR/css-position-3/#painting-order
            // 1. the background and borders of the element forming the stacking context.
            this.renderNodeBackgroundAndBorders(stack.container);
            // 2. the child stacking contexts with negative stack levels (most negative first).
            negativeZIndex.sort(sortByZIndex).forEach(this.renderStack, this);
            // 3. For all its in-flow, non-positioned, block-level descendants in tree order:
            this.renderNodeContent(stack.container);
            nonInlineLevel.forEach(this.renderNode, this);
            // 4. All non-positioned floating descendants, in tree order. For each one of these,
            // treat the element as if it created a new stacking context, but any positioned descendants and descendants
            // which actually create a new stacking context should be considered part of the parent stacking context,
            // not this new one.
            nonPositionedFloats.forEach(this.renderStack, this);
            // 5. the in-flow, inline-level, non-positioned descendants, including inline tables and inline blocks.
            nonPositionedInlineLevel.forEach(this.renderStack, this);
            inlineLevel.forEach(this.renderNode, this);
            // 6. All positioned, opacity or transform descendants, in tree order that fall into the following categories:
            //  All positioned descendants with 'z-index: auto' or 'z-index: 0', in tree order.
            //  For those with 'z-index: auto', treat the element as if it created a new stacking context,
            //  but any positioned descendants and descendants which actually create a new stacking context should be
            //  considered part of the parent stacking context, not this new one. For those with 'z-index: 0',
            //  treat the stacking context generated atomically.
            //
            //  All opacity descendants with opacity less than 1
            //
            //  All transform descendants with transform other than none
            zeroOrAutoZIndexOrTransformedOrOpacity.forEach(this.renderStack, this);
            // 7. Stacking contexts formed by positioned descendants with z-indices greater than or equal to 1 in z-index
            // order (smallest first) then tree order.
            positiveZIndex.sort(sortByZIndex).forEach(this.renderStack, this);

            if (transform !== null) {
                this.ctx.restore();
            }
        }
    }

    render(stack: StackingContext): Promise<HTMLCanvasElement> {
        this.ctx.scale(this.options.scale, this.options.scale);
        this.ctx.textBaseline = 'bottom';
        if (this.options.backgroundColor) {
            this.rectangle(
                0,
                0,
                this.canvas.width,
                this.canvas.height,
                this.options.backgroundColor
            );
        }
        this.renderStack(stack);
        return Promise.resolve(this.canvas);
    }
}

const splitDescendants = (stack: StackingContext): [Array<NodeContainer>, Array<NodeContainer>] => {
    const inlineLevel = [];
    const nonInlineLevel = [];

    const length = stack.children.length;
    for (let i = 0; i < length; i++) {
        let child = stack.children[i];
        if (child.isInlineLevel()) {
            inlineLevel.push(child);
        } else {
            nonInlineLevel.push(child);
        }
    }
    return [inlineLevel, nonInlineLevel];
};

const splitStackingContexts = (
    stack: StackingContext
): [
    Array<StackingContext>,
    Array<StackingContext>,
    Array<StackingContext>,
    Array<StackingContext>,
    Array<StackingContext>
] => {
    const negativeZIndex = [];
    const zeroOrAutoZIndexOrTransformedOrOpacity = [];
    const positiveZIndex = [];
    const nonPositionedFloats = [];
    const nonPositionedInlineLevel = [];
    const length = stack.contexts.length;
    for (let i = 0; i < length; i++) {
        let child = stack.contexts[i];
        if (
            child.container.isPositioned() ||
            child.container.style.opacity < 1 ||
            child.container.isTransformed()
        ) {
            if (child.container.style.zIndex.order < 0) {
                negativeZIndex.push(child);
            } else if (child.container.style.zIndex.order > 0) {
                positiveZIndex.push(child);
            } else {
                zeroOrAutoZIndexOrTransformedOrOpacity.push(child);
            }
        } else {
            if (child.container.isFloating()) {
                nonPositionedFloats.push(child);
            } else {
                nonPositionedInlineLevel.push(child);
            }
        }
    }
    return [
        negativeZIndex,
        zeroOrAutoZIndexOrTransformedOrOpacity,
        positiveZIndex,
        nonPositionedFloats,
        nonPositionedInlineLevel
    ];
};

const sortByZIndex = (a: StackingContext, b: StackingContext): number => {
    if (a.container.style.zIndex.order > b.container.style.zIndex.order) {
        return 1;
    } else if (a.container.style.zIndex.order < b.container.style.zIndex.order) {
        return -1;
    }
    return 0;
};
