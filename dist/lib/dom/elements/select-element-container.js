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
var SelectElementContainer = /** @class */ (function (_super) {
    __extends(SelectElementContainer, _super);
    function SelectElementContainer(element) {
        var _this = _super.call(this, element) || this;
        var option = element.options[element.selectedIndex || 0];
        _this.value = option ? option.text || '' : '';
        return _this;
    }
    return SelectElementContainer;
}(element_container_1.ElementContainer));
exports.SelectElementContainer = SelectElementContainer;
//# sourceMappingURL=select-element-container.js.map