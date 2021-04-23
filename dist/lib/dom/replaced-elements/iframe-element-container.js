"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var element_container_1 = require("../element-container");
var node_parser_1 = require("../node-parser");
var color_1 = require("../../css/types/color");
var parser_1 = require("../../css/syntax/parser");
var parseColor = function (value) { return color_1.color.parse(parser_1.Parser.create(value).parseComponentValue()); };
var IFrameElementContainer = /** @class */ (function (_super) {
    __extends(IFrameElementContainer, _super);
    function IFrameElementContainer(iframe) {
        var _this = _super.call(this, iframe) || this;
        _this.src = iframe.src;
        _this.width = parseInt(iframe.width, 10) || 0;
        _this.height = parseInt(iframe.height, 10) || 0;
        _this.backgroundColor = _this.styles.backgroundColor;
        try {
            if (iframe.contentWindow &&
                iframe.contentWindow.document &&
                iframe.contentWindow.document.documentElement) {
                _this.tree = node_parser_1.parseTree(iframe.contentWindow.document.documentElement);
                // http://www.w3.org/TR/css3-background/#special-backgrounds
                var documentBackgroundColor = iframe.contentWindow.document.documentElement
                    ? parseColor(getComputedStyle(iframe.contentWindow.document.documentElement)
                        .backgroundColor)
                    : color_1.COLORS.TRANSPARENT;
                var bodyBackgroundColor = iframe.contentWindow.document.body
                    ? parseColor(getComputedStyle(iframe.contentWindow.document.body).backgroundColor)
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