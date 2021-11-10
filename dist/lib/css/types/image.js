"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSupportedImage = exports.image = exports.isRadialGradient = exports.isLinearGradient = void 0;
var linear_gradient_1 = require("./functions/linear-gradient");
var _prefix_linear_gradient_1 = require("./functions/-prefix-linear-gradient");
var _webkit_gradient_1 = require("./functions/-webkit-gradient");
var radial_gradient_1 = require("./functions/radial-gradient");
var _prefix_radial_gradient_1 = require("./functions/-prefix-radial-gradient");
var isLinearGradient = function (background) {
    return background.type === 1 /* LINEAR_GRADIENT */;
};
exports.isLinearGradient = isLinearGradient;
var isRadialGradient = function (background) {
    return background.type === 2 /* RADIAL_GRADIENT */;
};
exports.isRadialGradient = isRadialGradient;
exports.image = {
    name: 'image',
    parse: function (context, value) {
        if (value.type === 22 /* URL_TOKEN */) {
            var image_1 = { url: value.value, type: 0 /* URL */ };
            context.cache.addImage(value.value);
            return image_1;
        }
        if (value.type === 18 /* FUNCTION */) {
            var imageFunction = SUPPORTED_IMAGE_FUNCTIONS[value.name];
            if (typeof imageFunction === 'undefined') {
                throw new Error("Attempting to parse an unsupported image function \"" + value.name + "\"");
            }
            return imageFunction(context, value.values);
        }
        throw new Error("Unsupported image type " + value.type);
    }
};
function isSupportedImage(value) {
    return (!(value.type === 20 /* IDENT_TOKEN */ && value.value === 'none') &&
        (value.type !== 18 /* FUNCTION */ || !!SUPPORTED_IMAGE_FUNCTIONS[value.name]));
}
exports.isSupportedImage = isSupportedImage;
var SUPPORTED_IMAGE_FUNCTIONS = {
    'linear-gradient': linear_gradient_1.linearGradient,
    '-moz-linear-gradient': _prefix_linear_gradient_1.prefixLinearGradient,
    '-ms-linear-gradient': _prefix_linear_gradient_1.prefixLinearGradient,
    '-o-linear-gradient': _prefix_linear_gradient_1.prefixLinearGradient,
    '-webkit-linear-gradient': _prefix_linear_gradient_1.prefixLinearGradient,
    'radial-gradient': radial_gradient_1.radialGradient,
    '-moz-radial-gradient': _prefix_radial_gradient_1.prefixRadialGradient,
    '-ms-radial-gradient': _prefix_radial_gradient_1.prefixRadialGradient,
    '-o-radial-gradient': _prefix_radial_gradient_1.prefixRadialGradient,
    '-webkit-radial-gradient': _prefix_radial_gradient_1.prefixRadialGradient,
    '-webkit-gradient': _webkit_gradient_1.webkitGradient
};
//# sourceMappingURL=image.js.map