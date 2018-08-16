/* @flow */
'use strict';

import type NodeContainer from './NodeContainer';
import {Bounds, parseBounds} from './Bounds';
import {TEXT_DECORATION} from './parsing/textDecoration';
import {FONT_VARIANT_LIGATURES} from './parsing/fontVariantLigatures';

import FEATURES from './Feature';
import {breakWords, toCodePoints, fromCodePoint} from './Unicode';

export class TextBounds {
    text: string;
    bounds: Bounds;

    constructor(text: string, bounds: Bounds) {
        this.text = text;
        this.bounds = bounds;
    }
}

export const parseTextBounds = (
    value: string,
    parent: NodeContainer,
    node: Text
): Array<TextBounds> => {
    const letterRendering = parent.style.letterSpacing !== 0;
    const textList = letterRendering
        ? toCodePoints(value).map(i => fromCodePoint(i))
        : breakWords(value, parent);
    const length = textList.length;
    const defaultView = node.parentNode ? node.parentNode.ownerDocument.defaultView : null;
    const scrollX = defaultView ? defaultView.pageXOffset : 0;
    const scrollY = defaultView ? defaultView.pageYOffset : 0;
    const textBounds = [];
    let offset = 0;
    for (let i = 0; i < length; i++) {
        let text = textList[i];
        if (parent.style.textDecoration !== TEXT_DECORATION.NONE || text.trim().length > 0) {
            if (FEATURES.SUPPORT_RANGE_BOUNDS) {
                textBounds.push(
                    new TextBounds(
                        text,
                        getRangeBounds(node, offset, text.length, scrollX, scrollY)
                    )
                );
            } else {
                const replacementNode = node.splitText(text.length);
                textBounds.push(new TextBounds(text, getWrapperBounds(node, scrollX, scrollY)));
                node = replacementNode;
            }
        } else if (!FEATURES.SUPPORT_RANGE_BOUNDS) {
            node = node.splitText(text.length);
        }
        offset += text.length;
    }
    if (
        parent.options.fixLigatures &&
        parent.style.fontVariantLigatures !== FONT_VARIANT_LIGATURES.NONE
    ) {
        fixLigatures(textBounds);
    }
    return textBounds;
};

const getWrapperBounds = (node: Text, scrollX: number, scrollY: number): Bounds => {
    const wrapper = node.ownerDocument.createElement('html2canvaswrapper');
    wrapper.appendChild(node.cloneNode(true));
    const parentNode = node.parentNode;
    if (parentNode) {
        parentNode.replaceChild(wrapper, node);
        const bounds = parseBounds(wrapper, scrollX, scrollY);
        if (wrapper.firstChild) {
            parentNode.replaceChild(wrapper.firstChild, wrapper);
        }
        return bounds;
    }
    return new Bounds(0, 0, 0, 0);
};

const getRangeBounds = (
    node: Text,
    offset: number,
    length: number,
    scrollX: number,
    scrollY: number
): Bounds => {
    const range = node.ownerDocument.createRange();
    range.setStart(node, offset);
    range.setEnd(node, offset + length);
    return Bounds.fromClientRect(range.getBoundingClientRect(), scrollX, scrollY);
};

const fixLigatures = (textBounds: Array<TextBounds>): void => {
    const size = textBounds.length;
    let prev = size > 0 ? textBounds[0].bounds : null;
    for (let i = 1; i < size; i++) {
        let bounds = textBounds[i].bounds;
        const next = i + 1 < size ? textBounds[i + 1].bounds : null;
        if (
            !prev ||
            !bounds.width ||
            !bounds.height ||
            bounds.top !== prev.top ||
            bounds.left !== prev.left
        ) {
            prev = bounds;
            continue;
        }
        if (next && bounds.top === next.top) {
            const ligatures = untilNonLigature(bounds, textBounds, i + 1);
            const ligLen = ligatures.length;
            const nonLig = ligatures[ligLen - 1];
            const nnext = ligatures[ligLen - 2] || next;
            const rightBound = (nonLig ? nonLig.left : nnext.left + nnext.width) - prev.left;
            bounds.left += rightBound / (1 + ligLen);
            if (ligLen > 1) {
                bounds = ligatures[ligLen - 2];
                i += ligLen - 1;
            }
        } else {
            bounds.left += prev.width / 2;
        }
        prev = bounds;
    }
};

const untilNonLigature = (
    ligatureBounds: Bounds,
    textBounds: Array<TextBounds>,
    startIndex: number
): Array<Bounds | null> => {
    const size = textBounds.length;
    let ligatures = [];
    let isFound = false;
    for (let i = startIndex; i < size; i++) {
        const bounds = textBounds[i].bounds;
        if (
            !bounds.width ||
            !bounds.height ||
            bounds.top > ligatureBounds.top ||
            bounds.left > ligatureBounds.left
        ) {
            isFound = true;
        }
        ligatures.push(bounds);

        if (isFound) {
            break;
        } else if (i === size - 1) {
            ligatures.push(null);
        }
    }
    return ligatures;
};
