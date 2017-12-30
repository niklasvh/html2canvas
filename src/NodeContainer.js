/* @flow */
'use strict';

import type {Background} from './parsing/background';
import type {Border} from './parsing/border';
import type {BorderRadius} from './parsing/borderRadius';
import type {DisplayBit} from './parsing/display';
import type {Float} from './parsing/float';
import type {Font} from './parsing/font';
import type {LineBreak} from './parsing/lineBreak';
import type {ListStyle} from './parsing/listStyle';
import type {Margin} from './parsing/margin';
import type {Overflow} from './parsing/overflow';
import type {OverflowWrap} from './parsing/overflowWrap';
import type {Padding} from './parsing/padding';
import type {Position} from './parsing/position';
import type {TextShadow} from './parsing/textShadow';
import type {TextTransform} from './parsing/textTransform';
import type {TextDecoration} from './parsing/textDecoration';
import type {Transform} from './parsing/transform';
import type {Visibility} from './parsing/visibility';
import type {WordBreak} from './parsing/word-break';
import type {zIndex} from './parsing/zIndex';

import type {Bounds, BoundCurves} from './Bounds';
import type ResourceLoader, {ImageElement} from './ResourceLoader';
import type {Path} from './drawing/Path';
import type TextContainer from './TextContainer';

import Color from './Color';

import {contains} from './Util';
import {parseBackground} from './parsing/background';
import {parseBorder} from './parsing/border';
import {parseBorderRadius} from './parsing/borderRadius';
import {parseDisplay, DISPLAY} from './parsing/display';
import {parseCSSFloat, FLOAT} from './parsing/float';
import {parseFont} from './parsing/font';
import {parseLetterSpacing} from './parsing/letterSpacing';
import {parseLineBreak} from './parsing/lineBreak';
import {parseListStyle} from './parsing/listStyle';
import {parseMargin} from './parsing/margin';
import {parseOverflow, OVERFLOW} from './parsing/overflow';
import {parseOverflowWrap} from './parsing/overflowWrap';
import {parsePadding} from './parsing/padding';
import {parsePosition, POSITION} from './parsing/position';
import {parseTextDecoration} from './parsing/textDecoration';
import {parseTextShadow} from './parsing/textShadow';
import {parseTextTransform} from './parsing/textTransform';
import {parseTransform} from './parsing/transform';
import {parseVisibility, VISIBILITY} from './parsing/visibility';
import {parseWordBreak} from './parsing/word-break';
import {parseZIndex} from './parsing/zIndex';

import {parseBounds, parseBoundCurves, calculatePaddingBoxPath} from './Bounds';
import {
    INPUT_BACKGROUND,
    INPUT_BORDERS,
    INPUT_COLOR,
    getInputBorderRadius,
    reformatInputBounds
} from './Input';
import {getListOwner} from './ListItem';

type StyleDeclaration = {
    background: Background,
    border: Array<Border>,
    borderRadius: Array<BorderRadius>,
    color: Color,
    display: DisplayBit,
    float: Float,
    font: Font,
    letterSpacing: number,
    lineBreak: LineBreak,
    listStyle: ListStyle | null,
    margin: Margin,
    opacity: number,
    overflow: Overflow,
    overflowWrap: OverflowWrap,
    padding: Padding,
    position: Position,
    textDecoration: TextDecoration | null,
    textShadow: Array<TextShadow> | null,
    textTransform: TextTransform,
    transform: Transform,
    visibility: Visibility,
    wordBreak: WordBreak,
    zIndex: zIndex
};

const INPUT_TAGS = ['INPUT', 'TEXTAREA', 'SELECT'];

export default class NodeContainer {
    name: ?string;
    parent: ?NodeContainer;
    style: StyleDeclaration;
    childNodes: Array<TextContainer | Path>;
    listItems: Array<NodeContainer>;
    listIndex: ?number;
    listStart: ?number;
    bounds: Bounds;
    curvedBounds: BoundCurves;
    image: ?string;
    index: number;
    tagName: string;

    constructor(
        node: HTMLElement | SVGSVGElement,
        parent: ?NodeContainer,
        resourceLoader: ResourceLoader,
        index: number
    ) {
        this.parent = parent;
        this.tagName = node.tagName;
        this.index = index;
        this.childNodes = [];
        this.listItems = [];
        if (typeof node.start === 'number') {
            this.listStart = node.start;
        }
        const defaultView = node.ownerDocument.defaultView;
        const scrollX = defaultView.pageXOffset;
        const scrollY = defaultView.pageYOffset;
        const style = defaultView.getComputedStyle(node, null);
        const display = parseDisplay(style.display);

        const IS_INPUT = node.type === 'radio' || node.type === 'checkbox';

        const position = parsePosition(style.position);

        this.style = {
            background: IS_INPUT ? INPUT_BACKGROUND : parseBackground(style, resourceLoader),
            border: IS_INPUT ? INPUT_BORDERS : parseBorder(style),
            borderRadius:
                (node instanceof defaultView.HTMLInputElement ||
                    node instanceof HTMLInputElement) &&
                IS_INPUT
                    ? getInputBorderRadius(node)
                    : parseBorderRadius(style),
            color: IS_INPUT ? INPUT_COLOR : new Color(style.color),
            display: display,
            float: parseCSSFloat(style.float),
            font: parseFont(style),
            letterSpacing: parseLetterSpacing(style.letterSpacing),
            listStyle: display === DISPLAY.LIST_ITEM ? parseListStyle(style) : null,
            lineBreak: parseLineBreak(style.lineBreak),
            margin: parseMargin(style),
            opacity: parseFloat(style.opacity),
            overflow:
                INPUT_TAGS.indexOf(node.tagName) === -1
                    ? parseOverflow(style.overflow)
                    : OVERFLOW.HIDDEN,
            overflowWrap: parseOverflowWrap(
                style.overflowWrap ? style.overflowWrap : style.wordWrap
            ),
            padding: parsePadding(style),
            position: position,
            textDecoration: parseTextDecoration(style),
            textShadow: parseTextShadow(style.textShadow),
            textTransform: parseTextTransform(style.textTransform),
            transform: parseTransform(style),
            visibility: parseVisibility(style.visibility),
            wordBreak: parseWordBreak(style.wordBreak),
            zIndex: parseZIndex(position !== POSITION.STATIC ? style.zIndex : 'auto')
        };

        if (this.isTransformed()) {
            // getBoundingClientRect provides values post-transform, we want them without the transformation
            node.style.transform = 'matrix(1,0,0,1,0,0)';
        }

        if (display === DISPLAY.LIST_ITEM) {
            const listOwner = getListOwner(this);
            if (listOwner) {
                const listIndex = listOwner.listItems.length;
                listOwner.listItems.push(this);
                this.listIndex =
                    node.hasAttribute('value') && typeof node.value === 'number'
                        ? node.value
                        : listIndex === 0
                          ? typeof listOwner.listStart === 'number' ? listOwner.listStart : 1
                          : listOwner.listItems[listIndex - 1].listIndex + 1;
            }
        }

        // TODO move bound retrieval for all nodes to a later stage?
        if (node.tagName === 'IMG') {
            node.addEventListener('load', () => {
                this.bounds = parseBounds(node, scrollX, scrollY);
                this.curvedBounds = parseBoundCurves(
                    this.bounds,
                    this.style.border,
                    this.style.borderRadius
                );
            });
        }
        this.image = getImage(node, resourceLoader);
        this.bounds = IS_INPUT
            ? reformatInputBounds(parseBounds(node, scrollX, scrollY))
            : parseBounds(node, scrollX, scrollY);
        this.curvedBounds = parseBoundCurves(
            this.bounds,
            this.style.border,
            this.style.borderRadius
        );

        if (__DEV__) {
            this.name = `${node.tagName.toLowerCase()}${node.id
                ? `#${node.id}`
                : ''}${node.className
                .toString()
                .split(' ')
                .map(s => (s.length ? `.${s}` : ''))
                .join('')}`;
        }
    }
    getClipPaths(): Array<Path> {
        const parentClips = this.parent ? this.parent.getClipPaths() : [];
        const isClipped = this.style.overflow !== OVERFLOW.VISIBLE;

        return isClipped
            ? parentClips.concat([calculatePaddingBoxPath(this.curvedBounds)])
            : parentClips;
    }
    isInFlow(): boolean {
        return this.isRootElement() && !this.isFloating() && !this.isAbsolutelyPositioned();
    }
    isVisible(): boolean {
        return (
            !contains(this.style.display, DISPLAY.NONE) &&
            this.style.opacity > 0 &&
            this.style.visibility === VISIBILITY.VISIBLE
        );
    }
    isAbsolutelyPositioned(): boolean {
        return this.style.position !== POSITION.STATIC && this.style.position !== POSITION.RELATIVE;
    }
    isPositioned(): boolean {
        return this.style.position !== POSITION.STATIC;
    }
    isFloating(): boolean {
        return this.style.float !== FLOAT.NONE;
    }
    isRootElement(): boolean {
        return this.parent === null;
    }
    isTransformed(): boolean {
        return this.style.transform !== null;
    }
    isPositionedWithZIndex(): boolean {
        return this.isPositioned() && !this.style.zIndex.auto;
    }
    isInlineLevel(): boolean {
        return (
            contains(this.style.display, DISPLAY.INLINE) ||
            contains(this.style.display, DISPLAY.INLINE_BLOCK) ||
            contains(this.style.display, DISPLAY.INLINE_FLEX) ||
            contains(this.style.display, DISPLAY.INLINE_GRID) ||
            contains(this.style.display, DISPLAY.INLINE_LIST_ITEM) ||
            contains(this.style.display, DISPLAY.INLINE_TABLE)
        );
    }
    isInlineBlockOrInlineTable(): boolean {
        return (
            contains(this.style.display, DISPLAY.INLINE_BLOCK) ||
            contains(this.style.display, DISPLAY.INLINE_TABLE)
        );
    }
}

const getImage = (node: HTMLElement | SVGSVGElement, resourceLoader: ResourceLoader): ?string => {
    if (
        node instanceof node.ownerDocument.defaultView.SVGSVGElement ||
        node instanceof SVGSVGElement
    ) {
        const s = new XMLSerializer();
        return resourceLoader.loadImage(
            `data:image/svg+xml,${encodeURIComponent(s.serializeToString(node))}`
        );
    }
    switch (node.tagName) {
        case 'IMG':
            // $FlowFixMe
            const img: HTMLImageElement = node;
            return resourceLoader.loadImage(img.currentSrc || img.src);
        case 'CANVAS':
            // $FlowFixMe
            const canvas: HTMLCanvasElement = node;
            return resourceLoader.loadCanvas(canvas);
        case 'IFRAME':
            const iframeKey = node.getAttribute('data-html2canvas-internal-iframe-key');
            if (iframeKey) {
                return iframeKey;
            }
            break;
    }

    return null;
};
