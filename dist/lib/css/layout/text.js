"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var overflow_wrap_1 = require("../property-descriptors/overflow-wrap");
var css_line_break_1 = require("css-line-break");
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
exports.parseTextBounds = function (value, styles, node) {
    var textList = breakText(value, styles);
    var textBounds = [];
    var offset = 0;
    textList.forEach(function (text) {
        if (styles.textDecorationLine.length || text.trim().length > 0) {
            if (features_1.FEATURES.SUPPORT_RANGE_BOUNDS) {
                textBounds.push(new TextBounds(text, getRangeBounds(node, offset, text.length)));
            }
            else {
                var replacementNode = node.splitText(text.length);
                textBounds.push(new TextBounds(text, getWrapperBounds(node)));
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
var getWrapperBounds = function (node) {
    var ownerDocument = node.ownerDocument;
    if (ownerDocument) {
        var wrapper = ownerDocument.createElement('html2canvaswrapper');
        wrapper.appendChild(node.cloneNode(true));
        var parentNode = node.parentNode;
        if (parentNode) {
            parentNode.replaceChild(wrapper, node);
            var bounds = bounds_1.parseBounds(wrapper);
            if (wrapper.firstChild) {
                parentNode.replaceChild(wrapper.firstChild, wrapper);
            }
            return bounds;
        }
    }
    return new bounds_1.Bounds(0, 0, 0, 0);
};
var getRangeBounds = function (node, offset, length) {
    var ownerDocument = node.ownerDocument;
    if (!ownerDocument) {
        throw new Error('Node has no owner document');
    }
    var range = ownerDocument.createRange();
    range.setStart(node, offset);
    range.setEnd(node, offset + length);
    return bounds_1.Bounds.fromClientRect(range.getBoundingClientRect());
};
var breakText = function (value, styles) {
    return styles.letterSpacing !== 0 ? css_line_break_1.toCodePoints(value).map(function (i) { return css_line_break_1.fromCodePoint(i); }) : breakWords(value, styles);
};
var breakWords = function (str, styles) {
    var breaker = css_line_break_1.LineBreaker(str, {
        lineBreak: styles.lineBreak,
        wordBreak: styles.overflowWrap === overflow_wrap_1.OVERFLOW_WRAP.BREAK_WORD ? 'break-word' : styles.wordBreak
    });
    var words = [];
    var bk;
    while (!(bk = breaker.next()).done) {
        if (bk.value) {
            words.push(bk.value.slice());
        }
    }
    return words;
};
//# sourceMappingURL=text.js.map