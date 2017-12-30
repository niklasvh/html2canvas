/* @flow */
'use strict';

import type NodeContainer from './NodeContainer';
import {Bounds, parseBounds} from './Bounds';
import {TEXT_DECORATION} from './parsing/textDecoration';

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
