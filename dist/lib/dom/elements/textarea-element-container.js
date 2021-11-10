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
exports.TextareaElementContainer = void 0;
var element_container_1 = require("../element-container");
var TextareaElementContainer = /** @class */ (function (_super) {
    __extends(TextareaElementContainer, _super);
    function TextareaElementContainer(context, element) {
        var _this = _super.call(this, context, element) || this;
        _this.value = element.value;
        return _this;
    }
    return TextareaElementContainer;
}(element_container_1.ElementContainer));
exports.TextareaElementContainer = TextareaElementContainer;
//# sourceMappingURL=textarea-element-container.js.map