import {CSSParsedDeclaration} from '../index';
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
    const textList = splitGraphemes(value);
    const textBounds: TextBounds[] = [];
    let offset = 0;
    textList.forEach((text) => {
        if (styles.textDecorationLine.length || text.trim().length > 0) {
            if (FEATURES.SUPPORT_RANGE_BOUNDS) {
                if (!FEATURES.SUPPORT_WORD_BREAKING) {
                    textBounds.push(
                        new TextBounds(
                            text,
                            Bounds.fromDOMRectList(context, createRange(node, offset, text.length).getClientRects())
                        )
                    );
                } else {
                    textBounds.push(new TextBounds(text, getRangeBounds(context, node, offset, text.length)));
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

const getRangeBounds = (context: Context, node: Text, offset: number, length: number): Bounds => {
    return Bounds.fromClientRect(context, createRange(node, offset, length).getBoundingClientRect());
};
