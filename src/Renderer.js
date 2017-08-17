/* @flow */
'use strict';

import type Color from './Color';
import type {Path} from './drawing/Path';
import type Size from './drawing/Size';
import type Logger from './Logger';

import type {BackgroundImage} from './parsing/background';
import type {Border, BorderSide} from './parsing/border';
import type {Font} from './parsing/font';
import type {TextDecoration} from './parsing/textDecoration';
import type {TextShadow} from './parsing/textShadow';
import type {Matrix} from './parsing/transform';

import type {BoundCurves} from './Bounds';
import type {Gradient} from './Gradient';
import type {ImageStore, ImageElement} from './ImageLoader';
import type NodeContainer from './NodeContainer';
import type StackingContext from './StackingContext';
import type {TextBounds} from './TextBounds';

import {
    Bounds,
    parsePathForBorder,
    calculateContentBox,
    calculatePaddingBox,
    calculatePaddingBoxPath
} from './Bounds';
import {FontMetrics} from './Font';
import {parseGradient} from './Gradient';
import TextContainer from './TextContainer';

import {
    BACKGROUND_ORIGIN,
    calculateBackgroungPaintingArea,
    calculateBackgroundPosition,
    calculateBackgroundRepeatPath,
    calculateBackgroundSize
} from './parsing/background';
import {BORDER_STYLE} from './parsing/border';

export type RenderOptions = {
    scale: number,
    backgroundColor: ?Color,
    imageStore: ImageStore<ImageElement>,
    fontMetrics: FontMetrics,
    logger: Logger,
    width: number,
    height: number
};

export interface RenderTarget<Output> {
    clip(clipPaths: Array<Path>, callback: () => void): void,

    drawImage(image: ImageElement, source: Bounds, destination: Bounds): void,

    drawShape(path: Path, color: Color): void,

    fill(color: Color): void,

    getTarget(): Promise<Output>,

    rectangle(x: number, y: number, width: number, height: number, color: Color): void,

    render(options: RenderOptions): void,

    renderLinearGradient(bounds: Bounds, gradient: Gradient): void,

    renderRepeat(
        path: Path,
        image: ImageElement,
        imageSize: Size,
        offsetX: number,
        offsetY: number
    ): void,

    renderTextNode(
        textBounds: Array<TextBounds>,
        color: Color,
        font: Font,
        textDecoration: TextDecoration | null,
        textShadows: Array<TextShadow> | null
    ): void,

    setOpacity(opacity: number): void,

    transform(offsetX: number, offsetY: number, matrix: Matrix, callback: () => void): void
}

export default class Renderer {
    target: RenderTarget<*>;
    options: RenderOptions;
    _opacity: ?number;

    constructor(target: RenderTarget<*>, options: RenderOptions) {
        this.target = target;
        this.options = options;
        target.render(options);
    }

    renderNode(container: NodeContainer) {
        if (container.isVisible()) {
            this.renderNodeBackgroundAndBorders(container);
            this.renderNodeContent(container);
        }
    }

    renderNodeContent(container: NodeContainer) {
        const callback = () => {
            if (container.childNodes.length) {
                container.childNodes.forEach(child => {
                    if (child instanceof TextContainer) {
                        const style = child.parent.style;
                        this.target.renderTextNode(
                            child.bounds,
                            style.color,
                            style.font,
                            style.textDecoration,
                            style.textShadow
                        );
                    } else {
                        this.target.drawShape(child, container.style.color);
                    }
                });
            }

            if (container.image) {
                const image = this.options.imageStore.get(container.image);
                if (image) {
                    const contentBox = calculateContentBox(
                        container.bounds,
                        container.style.padding,
                        container.style.border
                    );
                    const width =
                        typeof image.width === 'number' && image.width > 0
                            ? image.width
                            : contentBox.width;
                    const height =
                        typeof image.height === 'number' && image.height > 0
                            ? image.height
                            : contentBox.height;
                    if (width > 0 && height > 0) {
                        this.target.clip([calculatePaddingBoxPath(container.curvedBounds)], () => {
                            this.target.drawImage(
                                image,
                                new Bounds(0, 0, width, height),
                                contentBox
                            );
                        });
                    }
                }
            }
        };
        const paths = container.getClipPaths();
        if (paths.length) {
            this.target.clip(paths, callback);
        } else {
            callback();
        }
    }

    renderNodeBackgroundAndBorders(container: NodeContainer) {
        const HAS_BACKGROUND =
            !container.style.background.backgroundColor.isTransparent() ||
            container.style.background.backgroundImage.length;

        const renderableBorders = container.style.border.filter(
            border =>
                border.borderStyle !== BORDER_STYLE.NONE && !border.borderColor.isTransparent()
        );

        const callback = () => {
            const backgroundPaintingArea = calculateBackgroungPaintingArea(
                container.curvedBounds,
                container.style.background.backgroundClip
            );

            if (HAS_BACKGROUND) {
                this.target.clip([backgroundPaintingArea], () => {
                    if (!container.style.background.backgroundColor.isTransparent()) {
                        this.target.fill(container.style.background.backgroundColor);
                    }

                    this.renderBackgroundImage(container);
                });
            }

            renderableBorders.forEach((border, side) => {
                this.renderBorder(border, side, container.curvedBounds);
            });
        };

        if (HAS_BACKGROUND || renderableBorders.length) {
            const paths = container.parent ? container.parent.getClipPaths() : [];
            if (paths.length) {
                this.target.clip(paths, callback);
            } else {
                callback();
            }
        }
    }

    renderBackgroundImage(container: NodeContainer) {
        container.style.background.backgroundImage.slice(0).reverse().forEach(backgroundImage => {
            if (backgroundImage.source.method === 'url' && backgroundImage.source.args.length) {
                this.renderBackgroundRepeat(container, backgroundImage);
            } else {
                const gradient = parseGradient(backgroundImage.source, container.bounds);
                if (gradient) {
                    const bounds = container.bounds;
                    this.target.renderLinearGradient(bounds, gradient);
                }
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

            const offsetX = Math.round(paddingBox.left + position.x);
            const offsetY = Math.round(paddingBox.top + position.y);
            this.target.renderRepeat(path, image, backgroundImageSize, offsetX, offsetY);
        }
    }

    renderBorder(border: Border, side: BorderSide, curvePoints: BoundCurves) {
        this.target.drawShape(parsePathForBorder(curvePoints, side), border.borderColor);
    }

    renderStack(stack: StackingContext) {
        if (stack.container.isVisible()) {
            const opacity = stack.getOpacity();
            if (opacity !== this._opacity) {
                this.target.setOpacity(stack.getOpacity());
                this._opacity = opacity;
            }

            const transform = stack.container.style.transform;
            if (transform !== null) {
                this.target.transform(
                    stack.container.bounds.left + transform.transformOrigin[0].value,
                    stack.container.bounds.top + transform.transformOrigin[1].value,
                    transform.transform,
                    () => this.renderStackContent(stack)
                );
            } else {
                this.renderStackContent(stack);
            }
        }
    }

    renderStackContent(stack: StackingContext) {
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
    }

    render(stack: StackingContext): Promise<*> {
        if (this.options.backgroundColor) {
            this.target.rectangle(
                0,
                0,
                this.options.width,
                this.options.height,
                this.options.backgroundColor
            );
        }
        this.renderStack(stack);
        const target = this.target.getTarget();
        if (__DEV__) {
            return target.then(output => {
                this.options.logger.log(`Render completed`);
                return output;
            });
        }
        return target;
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

    return a.container.index > b.container.index ? 1 : -1;
};
