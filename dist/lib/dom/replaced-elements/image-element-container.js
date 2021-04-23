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
var cache_storage_1 = require("../../core/cache-storage");
var ImageElementContainer = /** @class */ (function (_super) {
    __extends(ImageElementContainer, _super);
    function ImageElementContainer(img) {
        var _this = _super.call(this, img) || this;
        _this.src = img.currentSrc || img.src;
        _this.intrinsicWidth = img.naturalWidth;
        _this.intrinsicHeight = img.naturalHeight;
        cache_storage_1.CacheStorage.getInstance().addImage(_this.src);
        return _this;
    }
    return ImageElementContainer;
}(element_container_1.ElementContainer));
exports.ImageElementContainer = ImageElementContainer;
//# sourceMappingURL=image-element-container.js.map