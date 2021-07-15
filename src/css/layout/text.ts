import {OVERFLOW_WRAP} from '../property-descriptors/overflow-wrap';
import {CSSParsedDeclaration} from '../index';
import {fromCodePoint, LineBreaker, toCodePoints} from 'css-line-break';
import {Bounds, parseBounds} from './bounds';
import {FEATURES} from '../../core/features';

export class TextBounds {
    readonly text: string;
    readonly bounds: Bounds;

    constructor(text: string, bounds: Bounds) {
        this.text = text;
        this.bounds = bounds;
    }
}

export const parseTextBounds = (value: string, styles: CSSParsedDeclaration, node: Text): TextBounds[] => {
    const textList = breakText(value, styles);
    const textBounds: TextBounds[] = [];
    let offset = 0;
    textList.forEach((text) => {
        if (styles.textDecorationLine.length || text.trim().length > 0) {
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
    });

    return textBounds;
};

const getWrapperBounds = (node: Text): Bounds => {
    const ownerDocument = node.ownerDocument;
    if (ownerDocument) {
        const wrapper = ownerDocument.createElement('html2canvaswrapper');
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
    }

    return new Bounds(0, 0, 0, 0);
};

const getRangeBounds = (node: Text, offset: number, length: number): Bounds => {
    const ownerDocument = node.ownerDocument;
    if (!ownerDocument) {
        throw new Error('Node has no owner document');
    }
    const range = ownerDocument.createRange();
    range.setStart(node, offset);
    range.setEnd(node, offset + length);
    return Bounds.fromClientRect(range.getBoundingClientRect());
};

const breakText = (value: string, styles: CSSParsedDeclaration): string[] => {
    return styles.letterSpacing !== 0 ? toCodePoints(value).map((i) => fromCodePoint(i)) : breakWords(value, styles);
};

// https://drafts.csswg.org/css-text/#word-separator
const wordSeparators = [0x0020, 0x00a0, 0x1361, 0x10100, 0x10101, 0x1039, 0x1091];

const breakWords = (str: string, styles: CSSParsedDeclaration): string[] => {
    const breaker = LineBreaker(str, {
        lineBreak: styles.lineBreak,
        wordBreak: styles.overflowWrap === OVERFLOW_WRAP.BREAK_WORD ? 'break-word' : styles.wordBreak
    });

    const words = [];
    let bk;

    while (!(bk = breaker.next()).done) {
        if (bk.value) {
            const value = bk.value.slice();
            const codePoints = toCodePoints(value);
            let word = '';
            codePoints.forEach((codePoint) => {
                if (wordSeparators.indexOf(codePoint) === -1) {
                    word += fromCodePoint(codePoint);
                } else {
                    if (word.length) {
                        words.push(word);
                    }
                    words.push(fromCodePoint(codePoint));
                    word = '';
                }
            });

            if (word.length) {
                words.push(word);
            }
        }
    }

    return words;
};
