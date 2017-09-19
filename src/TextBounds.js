/* @flow */
'use strict';

import {ucs2} from 'punycode';
import type NodeContainer from './NodeContainer';
import {Bounds, parseBounds} from './Bounds';
import {TEXT_DECORATION} from './parsing/textDecoration';

import FEATURES from './Feature';

const RTL = /[\u0590-\u074f]/;
const UNICODE = /[^\u0000-\u00ff]/;

const hasRtlCharacters = (word: string): boolean => RTL.test(word);
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
    const letterRendering = parent.style.letterSpacing !== 0 ||
        (!hasUnicodeCharacters(value) && !hasRtlCharacters(value));
    const textList = letterRendering ? codePoints.map(encodeCodePoint) : splitWords(codePoints);
    const length = textList.length;
    const textBounds = [];
    let offset = 0;
    for (let i = 0; i < length; i++) {
        let text = textList[i];
        if (parent.style.textDecoration !== TEXT_DECORATION.NONE || text.trim().length > 0) {
            if (FEATURES.SUPPORT_RANGE_BOUNDS) {
                textBounds.push(new TextBounds(text, getRangeBounds(node, offset, text.length)));
            } else {
                const replacementNode = node.splitText(text.length);
                textBounds.push(new TextBounds(text, getWrapperBounds(node)));
                node = replacementNode;
            }
        } else if (!FEATURES.SUPPORT_RANGE_BOUNDS) {
            node = node.splitText(text.length);
        }
        offset += text.length;
    }
    return textBounds;
};

const getWrapperBounds = (node: Text): Bounds => {
    const wrapper = node.ownerDocument.createElement('html2canvaswrapper');
    wrapper.appendChild(node.cloneNode(true));
    const parentNode = node.parentNode;
    if (parentNode) {
        parentNode.replaceChild(wrapper, node);
        const bounds = parseBounds(wrapper);
        if (wrapper.firstChild) {
            parentNode.replaceChild(wrapper.firstChild, wrapper);
        }
        return bounds;
    }
    return new Bounds(0, 0, 0, 0);
};

const getRangeBounds = (node: Text, offset: number, length: number): Bounds => {
    const range = node.ownerDocument.createRange();
    range.setStart(node, offset);
    range.setEnd(node, offset + length);
    return Bounds.fromClientRect(range.getBoundingClientRect());
};

const splitWords = (codePoints: Array<number>): Array<string> => {
    // Get words and whether they are RTL or LTR
    const { words, rtlIndicators } = findWordsAndWordCategories(codePoints);
    // For RTL words, we should swap brackets
    flipCharactersForRtlWordsIfNeeded(words, rtlIndicators);
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

const SUPPORTED_RTL_CATEGORIES = {
    ARABIC: 'ARABIC',
    HEBREW: 'HEBREW',
    SYRIAC: 'SYRIAC',
};

const LTR_CATEGORY = 'LTR';

const CHARACTERS_TO_FLIP_IF_NEXT_WORD_IS_RTL = [
    '(',
    '[',
    '{',
];

const CHARACTERS_TO_FLIP_IF_PREVIOUS_WORD_IS_RTL = [
    ')',
    ']',
    '}',
];

const CHARACTER_TO_FLIPPED_CHARACTER_MAP = {
    // PARENS
    '(': ')',
    ')': '(',
    // BRACKETS
    '[': ']',
    ']': '[',
    // BRACES
    '{': '}',
    '}': '{',
}

type FindWordsAndWordCategoriesResult = {
    rtlIndicators: Array<boolean>,
    words: Array<string>,
};

const findWordsAndWordCategories = (codePoints: Array<number>): FindWordsAndWordCategoriesResult => {
    const words = [];
    const rtlIndicators = [];
    let i = 0;
    let onWordBoundary = false;
    // Store whether the text is LTR or RTL
    let previousScriptCategory = null;
    let word;
    while (codePoints.length) {
        const codePointScriptCategory = getUtf8ScriptCategory(codePoints[i]);
        if (previousScriptCategory == null) {
            previousScriptCategory = codePointScriptCategory;
        }
        if (isWordBoundary(codePoints[i]) === onWordBoundary) {
            word = codePoints.splice(0, i);
            if (word.length) {
                words.push(ucs2.encode(word));
                rtlIndicators.push(isRtlCategory(previousScriptCategory));
            }
            onWordBoundary = !onWordBoundary;
            i = 0;
            previousScriptCategory = null;
        } else {
            i++;
        }

        if (i >= codePoints.length) {
            word = codePoints.splice(0, i);
            if (word.length) {
                words.push(ucs2.encode(word));
                rtlIndicators.push(isRtlCategory(previousScriptCategory));
            }
        }
    }

    return {
        words,
        rtlIndicators,
    }
}

const flipCharactersForRtlWordsIfNeeded = (words: Array<string>, rtlIndicators: Array<boolean>): void => {
    words.forEach((word, indexOfWord) => {
        const isNextWordRtl = rtlIndicators[indexOfWord + 1] || false;
        const isPreviousWordRtl = rtlIndicators[indexOfWord - 1] || false;
        word.split('').forEach((letter, indexOfLetter) => {
            if ((CHARACTERS_TO_FLIP_IF_NEXT_WORD_IS_RTL.indexOf(letter) !== -1 && isNextWordRtl) ||
                (CHARACTERS_TO_FLIP_IF_PREVIOUS_WORD_IS_RTL.indexOf(letter) !== -1 && isPreviousWordRtl)) {
                words[indexOfWord] = replaceIndexAt(word, indexOfLetter, CHARACTER_TO_FLIPPED_CHARACTER_MAP[letter]);
            }
        });
    });
}

const replaceIndexAt = (word: string, indexToReplace: number, replacementString: string): string => (
    word.substring(0, indexToReplace) + replacementString + word.substring(indexToReplace + 1)
)

const isRtlCategory = (category: string | null): boolean => !!category && category !== LTR_CATEGORY;

const getUtf8ScriptCategory = (char: number): string => {
    if(char >= 0x0590 && char <= 0x05ff) {
        return SUPPORTED_RTL_CATEGORIES.HEBREW;
    } else if (char >= 0x0600 && char <= 0x06ff) {
        return SUPPORTED_RTL_CATEGORIES.ARABIC;
    } else if(char >= 0x0700 && char <= 0x074f) {
        return SUPPORTED_RTL_CATEGORIES.SYRIAC;
    } else {
        return LTR_CATEGORY;
    }
};

