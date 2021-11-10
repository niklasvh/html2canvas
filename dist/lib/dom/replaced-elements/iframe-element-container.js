"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.IFrameElementContainer = void 0;
var element_container_1 = require("../element-container");
var node_parser_1 = require("../node-parser");
var color_1 = require("../../css/types/color");
var IFrameElementContainer = /** @class */ (function (_super) {
    __extends(IFrameElementContainer, _super);
    function IFrameElementContainer(context, iframe) {
        var _this = _super.call(this, context, iframe) || this;
        _this.src = iframe.src;
        _this.width = parseInt(iframe.width, 10) || 0;
        _this.height = parseInt(iframe.height, 10) || 0;
        _this.backgroundColor = _this.styles.backgroundColor;
        try {
            if (iframe.contentWindow &&
                iframe.contentWindow.document &&
                iframe.contentWindow.document.documentElement) {
                _this.tree = node_parser_1.parseTree(context, iframe.contentWindow.document.documentElement);
                // http://www.w3.org/TR/css3-background/#special-backgrounds
                var documentBackgroundColor = iframe.contentWindow.document.documentElement
                    ? color_1.parseColor(context, getComputedStyle(iframe.contentWindow.document.documentElement).backgroundColor)
                    : color_1.COLORS.TRANSPARENT;
                var bodyBackgroundColor = iframe.contentWindow.document.body
                    ? color_1.parseColor(context, getComputedStyle(iframe.contentWindow.document.body).backgroundColor)
                    : color_1.COLORS.TRANSPARENT;
                _this.backgroundColor = color_1.isTransparent(documentBackgroundColor)
                    ? color_1.isTransparent(bodyBackgroundColor)
                        ? _this.styles.backgroundColor
                        : bodyBackgroundColor
                    : documentBackgroundColor;
            }
        }
        catch (e) { }
        return _this;
    }
    return IFrameElementContainer;
}(element_container_1.ElementContainer));
exports.IFrameElementContainer = IFrameElementContainer;
//# sourceMappingURL=iframe-element-container.js.map