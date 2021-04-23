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
var border_style_1 = require("../../css/property-descriptors/border-style");
var background_clip_1 = require("../../css/property-descriptors/background-clip");
var tokenizer_1 = require("../../css/syntax/tokenizer");
var bounds_1 = require("../../css/layout/bounds");
var CHECKBOX_BORDER_RADIUS = [
    {
        type: tokenizer_1.TokenType.DIMENSION_TOKEN,
        flags: 0,
        unit: 'px',
        number: 3
    }
];
var RADIO_BORDER_RADIUS = [
    {
        type: tokenizer_1.TokenType.PERCENTAGE_TOKEN,
        flags: 0,
        number: 50
    }
];
var reformatInputBounds = function (bounds) {
    if (bounds.width > bounds.height) {
        return new bounds_1.Bounds(bounds.left + (bounds.width - bounds.height) / 2, bounds.top, bounds.height, bounds.height);
    }
    else if (bounds.width < bounds.height) {
        return new bounds_1.Bounds(bounds.left, bounds.top + (bounds.height - bounds.width) / 2, bounds.width, bounds.width);
    }
    return bounds;
};
var getInputValue = function (node) {
    var value = node.type === exports.PASSWORD ? new Array(node.value.length + 1).join('\u2022') : node.value;
    return value.length === 0 ? node.placeholder || '' : value;
};
exports.CHECKBOX = 'checkbox';
exports.RADIO = 'radio';
exports.PASSWORD = 'password';
exports.INPUT_COLOR = 0x2a2a2aff;
var InputElementContainer = /** @class */ (function (_super) {
    __extends(InputElementContainer, _super);
    function InputElementContainer(input) {
        var _this = _super.call(this, input) || this;
        _this.type = input.type.toLowerCase();
        _this.checked = input.checked;
        _this.value = getInputValue(input);
        if (_this.type === exports.CHECKBOX || _this.type === exports.RADIO) {
            _this.styles.backgroundColor = 0xdededeff;
            _this.styles.borderTopColor = _this.styles.borderRightColor = _this.styles.borderBottomColor = _this.styles.borderLeftColor = 0xa5a5a5ff;
            _this.styles.borderTopWidth = _this.styles.borderRightWidth = _this.styles.borderBottomWidth = _this.styles.borderLeftWidth = 1;
            _this.styles.borderTopStyle = _this.styles.borderRightStyle = _this.styles.borderBottomStyle = _this.styles.borderLeftStyle =
                border_style_1.BORDER_STYLE.SOLID;
            _this.styles.backgroundClip = [background_clip_1.BACKGROUND_CLIP.BORDER_BOX];
            _this.styles.backgroundOrigin = [0 /* BORDER_BOX */];
            _this.bounds = reformatInputBounds(_this.bounds);
        }
        switch (_this.type) {
            case exports.CHECKBOX:
                _this.styles.borderTopRightRadius = _this.styles.borderTopLeftRadius = _this.styles.borderBottomRightRadius = _this.styles.borderBottomLeftRadius = CHECKBOX_BORDER_RADIUS;
                break;
            case exports.RADIO:
                _this.styles.borderTopRightRadius = _this.styles.borderTopLeftRadius = _this.styles.borderBottomRightRadius = _this.styles.borderBottomLeftRadius = RADIO_BORDER_RADIUS;
                break;
        }
        return _this;
    }
    return InputElementContainer;
}(element_container_1.ElementContainer));
exports.InputElementContainer = InputElementContainer;
//# sourceMappingURL=input-element-container.js.map