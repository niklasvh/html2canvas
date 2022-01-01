import {OVERFLOW_WRAP} from '../property-descriptors/overflow-wrap';
import {CSSParsedDeclaration} from '../index';
import {fromCodePoint, LineBreaker, toCodePoints} from 'css-line-break';
import {splitGraphemes} from 'text-segmentation';
import {Bounds, parseBounds} from './bounds';
import {FEATURES} from '../../core/features';
import {Context} from '../../core/context';

export class TextBounds {
    readonly text: string;
    readonly bounds: Bounds;

    constructor(text: string, bounds: Bounds) {
        this.text = text;
        this.bounds = bounds;
    }
}

export const parseTextBounds = (
    context: Context,
    value: string,
    styles: CSSParsedDeclaration,
    node: Text
): TextBounds[] => {
    const textList = breakText(value, styles);
    const textBounds: TextBounds[] = [];
    let offset = 0;
    textList.forEach((text) => {
        if (styles.textDecorationLine.length || text.trim().length > 0) {
            if (FEATURES.SUPPORT_RANGE_BOUNDS) {
                const clientRects = createRange(node, offset, text.length).getClientRects();
                if (clientRects.length > 1) {
                    const subSegments = segmentGraphemes(text);
                    let subOffset = 0;
                    subSegments.forEach((subSegment) => {
                        textBounds.push(
                            new TextBounds(
                                subSegment,
                                Bounds.fromDOMRectList(
                                    context,
                                    createRange(node, subOffset + offset, subSegment.length).getClientRects()
                                )
                            )
                        );
                        subOffset += subSegment.length;
                    });
                } else {
                    textBounds.push(new TextBounds(text, Bounds.fromDOMRectList(context, clientRects)));
                }
            } else {
                const replacementNode = node.splitText(text.length);
                textBounds.push(new TextBounds(text, getWrapperBounds(context, node)));
                node = replacementNode;
            }
        } else if (!FEATURES.SUPPORT_RANGE_BOUNDS) {
            node = node.splitText(text.length);
        }
        offset += text.length;
    });

    return textBounds;
};

const getWrapperBounds = (context: Context, node: Text): Bounds => {
    const ownerDocument = node.ownerDocument;
    if (ownerDocument) {
        const wrapper = ownerDocument.createElement('html2canvaswrapper');
        wrapper.appendChild(node.cloneNode(true));
        const parentNode = node.parentNode;
        if (parentNode) {
            parentNode.replaceChild(wrapper, node);
            const bounds = parseBounds(context, wrapper);
            if (wrapper.firstChild) {
                parentNode.replaceChild(wrapper.firstChild, wrapper);
            }
            return bounds;
        }
    }

    return Bounds.EMPTY;
};

const createRange = (node: Text, offset: number, length: number): Range => {
    const ownerDocument = node.ownerDocument;
    if (!ownerDocument) {
        throw new Error('Node has no owner document');
    }
    const range = ownerDocument.createRange();
    range.setStart(node, offset);
    range.setEnd(node, offset + length);
    return range;
};

export const segmentGraphemes = (value: string): string[] => {
    if (FEATURES.SUPPORT_NATIVE_TEXT_SEGMENTATION) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const segmenter = new (Intl as any).Segmenter(void 0, {granularity: 'grapheme'});
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return Array.from(segmenter.segment(value)).map((segment: any) => segment.segment);
    }

    return splitGraphemes(value);
};

const segmentWords = (value: string, styles: CSSParsedDeclaration): string[] => {
    if (FEATURES.SUPPORT_NATIVE_TEXT_SEGMENTATION) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const segmenter = new (Intl as any).Segmenter(void 0, {
            granularity: 'word'
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return Array.from(segmenter.segment(value)).map((segment: any) => segment.segment);
    }

    return breakWords(value, styles);
};

const breakText = (value: string, styles: CSSParsedDeclaration): string[] => {
    return styles.letterSpacing !== 0 ? segmentGraphemes(value) : segmentWords(value, styles);
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
