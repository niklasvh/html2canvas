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
exports.SVGElementContainer = void 0;
var element_container_1 = require("../element-container");
var bounds_1 = require("../../css/layout/bounds");
var SVGElementContainer = /** @class */ (function (_super) {
    __extends(SVGElementContainer, _super);
    function SVGElementContainer(context, img) {
        var _this = _super.call(this, context, img) || this;
        var s = new XMLSerializer();
        var bounds = bounds_1.parseBounds(context, img);
        img.setAttribute('width', bounds.width + "px");
        img.setAttribute('height', bounds.height + "px");
        _this.svg = "data:image/svg+xml," + encodeURIComponent(s.serializeToString(img));
        _this.intrinsicWidth = img.width.baseVal.value;
        _this.intrinsicHeight = img.height.baseVal.value;
        _this.context.cache.addImage(_this.svg);
        return _this;
    }
    return SVGElementContainer;
}(element_container_1.ElementContainer));
exports.SVGElementContainer = SVGElementContainer;
//# sourceMappingURL=svg-element-container.js.map