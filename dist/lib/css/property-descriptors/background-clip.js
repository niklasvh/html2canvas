"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var IPropertyDescriptor_1 = require("../IPropertyDescriptor");
var parser_1 = require("../syntax/parser");
var BACKGROUND_CLIP;
(function (BACKGROUND_CLIP) {
    BACKGROUND_CLIP[BACKGROUND_CLIP["BORDER_BOX"] = 0] = "BORDER_BOX";
    BACKGROUND_CLIP[BACKGROUND_CLIP["PADDING_BOX"] = 1] = "PADDING_BOX";
    BACKGROUND_CLIP[BACKGROUND_CLIP["CONTENT_BOX"] = 2] = "CONTENT_BOX";
})(BACKGROUND_CLIP = exports.BACKGROUND_CLIP || (exports.BACKGROUND_CLIP = {}));
exports.backgroundClip = {
    name: 'background-clip',
    initialValue: 'border-box',
    prefix: false,
    type: IPropertyDescriptor_1.PropertyDescriptorParsingType.LIST,
    parse: function (tokens) {
        return tokens.map(function (token) {
            if (parser_1.isIdentToken(token)) {
                switch (token.value) {
                    case 'padding-box':
                        return BACKGROUND_CLIP.PADDING_BOX;
                    case 'content-box':
                        return BACKGROUND_CLIP.CONTENT_BOX;
                }
            }
            return BACKGROUND_CLIP.BORDER_BOX;
        });
    }
};
//# sourceMappingURL=background-clip.js.map