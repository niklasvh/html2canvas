"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contentBox = exports.paddingBox = void 0;
var length_percentage_1 = require("../css/types/length-percentage");
var paddingBox = function (element) {
    var bounds = element.bounds;
    var styles = element.styles;
    return bounds.add(styles.borderLeftWidth, styles.borderTopWidth, -(styles.borderRightWidth + styles.borderLeftWidth), -(styles.borderTopWidth + styles.borderBottomWidth));
};
exports.paddingBox = paddingBox;
var contentBox = function (element) {
    var styles = element.styles;
    var bounds = element.bounds;
    var paddingLeft = length_percentage_1.getAbsoluteValue(styles.paddingLeft, bounds.width);
    var paddingRight = length_percentage_1.getAbsoluteValue(styles.paddingRight, bounds.width);
    var paddingTop = length_percentage_1.getAbsoluteValue(styles.paddingTop, bounds.width);
    var paddingBottom = length_percentage_1.getAbsoluteValue(styles.paddingBottom, bounds.width);
    return bounds.add(paddingLeft + styles.borderLeftWidth, paddingTop + styles.borderTopWidth, -(styles.borderRightWidth + styles.borderLeftWidth + paddingLeft + paddingRight), -(styles.borderTopWidth + styles.borderBottomWidth + paddingTop + paddingBottom));
};
exports.contentBox = contentBox;
//# sourceMappingURL=box-sizing.js.map