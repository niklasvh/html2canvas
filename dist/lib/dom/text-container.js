"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextContainer = void 0;
var text_1 = require("../css/layout/text");
var TextContainer = /** @class */ (function () {
    function TextContainer(context, node, styles) {
        this.text = transform(node.data, styles.textTransform);
        this.textBounds = text_1.parseTextBounds(context, this.text, styles, node);
    }
    return TextContainer;
}());
exports.TextContainer = TextContainer;
var transform = function (text, transform) {
    switch (transform) {
        case 1 /* LOWERCASE */:
            return text.toLowerCase();
        case 3 /* CAPITALIZE */:
            return text.replace(CAPITALIZE, capitalize);
        case 2 /* UPPERCASE */:
            return text.toUpperCase();
        default:
            return text;
    }
};
var CAPITALIZE = /(^|\s|:|-|\(|\))([a-z])/g;
var capitalize = function (m, p1, p2) {
    if (m.length > 0) {
        return p1 + p2.toUpperCase();
    }
    return m;
};
//# sourceMappingURL=text-container.js.map