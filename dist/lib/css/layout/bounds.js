"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseDocumentSize = exports.parseBounds = exports.Bounds = void 0;
var Bounds = /** @class */ (function () {
    function Bounds(left, top, width, height) {
        this.left = left;
        this.top = top;
        this.width = width;
        this.height = height;
    }
    Bounds.prototype.add = function (x, y, w, h) {
        return new Bounds(this.left + x, this.top + y, this.width + w, this.height + h);
    };
    Bounds.fromClientRect = function (context, clientRect) {
        return new Bounds(clientRect.left + context.windowBounds.left, clientRect.top + context.windowBounds.top, clientRect.width, clientRect.height);
    };
    Bounds.fromDOMRectList = function (context, domRectList) {
        var domRect = domRectList[0];
        return domRect
            ? new Bounds(domRect.x + context.windowBounds.left, domRect.y + context.windowBounds.top, domRect.width, domRect.height)
            : Bounds.EMPTY;
    };
    Bounds.EMPTY = new Bounds(0, 0, 0, 0);
    return Bounds;
}());
exports.Bounds = Bounds;
var parseBounds = function (context, node) {
    return Bounds.fromClientRect(context, node.getBoundingClientRect());
};
exports.parseBounds = parseBounds;
var parseDocumentSize = function (document) {
    var body = document.body;
    var documentElement = document.documentElement;
    if (!body || !documentElement) {
        throw new Error("Unable to get document size");
    }
    var width = Math.max(Math.max(body.scrollWidth, documentElement.scrollWidth), Math.max(body.offsetWidth, documentElement.offsetWidth), Math.max(body.clientWidth, documentElement.clientWidth));
    var height = Math.max(Math.max(body.scrollHeight, documentElement.scrollHeight), Math.max(body.offsetHeight, documentElement.offsetHeight), Math.max(body.clientHeight, documentElement.clientHeight));
    return new Bounds(0, 0, width, height);
};
exports.parseDocumentSize = parseDocumentSize;
//# sourceMappingURL=bounds.js.map