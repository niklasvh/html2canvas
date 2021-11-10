"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseTextBounds = exports.TextBounds = void 0;
var css_line_break_1 = require("css-line-break");
var text_segmentation_1 = require("text-segmentation");
var bounds_1 = require("./bounds");
var features_1 = require("../../core/features");
var TextBounds = /** @class */ (function () {
    function TextBounds(text, bounds) {
        this.text = text;
        this.bounds = bounds;
    }
    return TextBounds;
}());
exports.TextBounds = TextBounds;
var parseTextBounds = function (context, value, styles, node) {
    var textList = breakText(value, styles);
    var textBounds = [];
    var offset = 0;
    textList.forEach(function (text) {
        if (styles.textDecorationLine.length || text.trim().length > 0) {
            if (features_1.FEATURES.SUPPORT_RANGE_BOUNDS) {
                if (!features_1.FEATURES.SUPPORT_WORD_BREAKING) {
                    textBounds.push(new TextBounds(text, bounds_1.Bounds.fromDOMRectList(context, createRange(node, offset, text.length).getClientRects())));
                }
                else {
                    textBounds.push(new TextBounds(text, getRangeBounds(context, node, offset, text.length)));
                }
            }
            else {
                var replacementNode = node.splitText(text.length);
                textBounds.push(new TextBounds(text, getWrapperBounds(context, node)));
                node = replacementNode;
            }
        }
        else if (!features_1.FEATURES.SUPPORT_RANGE_BOUNDS) {
            node = node.splitText(text.length);
        }
        offset += text.length;
    });
    return textBounds;
};
exports.parseTextBounds = parseTextBounds;
var getWrapperBounds = function (context, node) {
    var ownerDocument = node.ownerDocument;
    if (ownerDocument) {
        var wrapper = ownerDocument.createElement('html2canvaswrapper');
        wrapper.appendChild(node.cloneNode(true));
        var parentNode = node.parentNode;
        if (parentNode) {
            parentNode.replaceChild(wrapper, node);
            var bounds = bounds_1.parseBounds(context, wrapper);
            if (wrapper.firstChild) {
                parentNode.replaceChild(wrapper.firstChild, wrapper);
            }
            return bounds;
        }
    }
    return bounds_1.Bounds.EMPTY;
};
var createRange = function (node, offset, length) {
    var ownerDocument = node.ownerDocument;
    if (!ownerDocument) {
        throw new Error('Node has no owner document');
    }
    var range = ownerDocument.createRange();
    range.setStart(node, offset);
    range.setEnd(node, offset + length);
    return range;
};
var getRangeBounds = function (context, node, offset, length) {
    return bounds_1.Bounds.fromClientRect(context, createRange(node, offset, length).getBoundingClientRect());
};
var breakText = function (value, styles) {
    return styles.letterSpacing !== 0 ? text_segmentation_1.splitGraphemes(value) : breakWords(value, styles);
};
// https://drafts.csswg.org/css-text/#word-separator
var wordSeparators = [0x0020, 0x00a0, 0x1361, 0x10100, 0x10101, 0x1039, 0x1091];
var breakWords = function (str, styles) {
    var breaker = css_line_break_1.LineBreaker(str, {
        lineBreak: styles.lineBreak,
        wordBreak: styles.overflowWrap === "break-word" /* BREAK_WORD */ ? 'break-word' : styles.wordBreak
    });
    var words = [];
    var bk;
    var _loop_1 = function () {
        if (bk.value) {
            var value = bk.value.slice();
            var codePoints = css_line_break_1.toCodePoints(value);
            var word_1 = '';
            codePoints.forEach(function (codePoint) {
                if (wordSeparators.indexOf(codePoint) === -1) {
                    word_1 += css_line_break_1.fromCodePoint(codePoint);
                }
                else {
                    if (word_1.length) {
                        words.push(word_1);
                    }
                    words.push(css_line_break_1.fromCodePoint(codePoint));
                    word_1 = '';
                }
            });
            if (word_1.length) {
                words.push(word_1);
            }
        }
    };
    while (!(bk = breaker.next()).done) {
        _loop_1();
    }
    return words;
};
//# sourceMappingURL=text.js.map