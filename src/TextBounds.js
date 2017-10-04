/* @flow */
'use strict';

import {ucs2} from 'punycode';
import type NodeContainer from './NodeContainer';
import {Bounds, parseBounds} from './Bounds';
import {TEXT_DECORATION} from './parsing/textDecoration';

import FEATURES from './Feature';

const UNICODE = /[^\u0000-\u00ff]/;

const hasUnicodeCharacters = (text: string): boolean => UNICODE.test(text);

const encodeCodePoint = (codePoint: number): string => ucs2.encode([codePoint]);

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
    const codePoints = ucs2.decode(value);
    const letterRendering = parent.style.letterSpacing !== 0 || hasUnicodeCharacters(value);
    const textList = letterRendering ? codePoints.map(encodeCodePoint) : splitWords(codePoints);
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

const splitWords = (codePoints: Array<number>): Array<string> => {
    const words = [];
    let i = 0;
    let onWordBoundary = false;
    let word;
    while (codePoints.length) {
        if (isWordBoundary(codePoints[i]) === onWordBoundary) {
            word = codePoints.splice(0, i);
            if (word.length) {
                words.push(ucs2.encode(word));
            }
            onWordBoundary = !onWordBoundary;
            i = 0;
        } else {
            i++;
        }

        if (i >= codePoints.length) {
            word = codePoints.splice(0, i);
            if (word.length) {
                words.push(ucs2.encode(word));
            }
        }
    }
    return words;
};

const isWordBoundary = (characterCode: number): boolean => {
    return (
        [
            32, // <space>
            13, // \r
            10, // \n
            9, // \t
            45 // -
        ].indexOf(characterCode) !== -1
    );
};
