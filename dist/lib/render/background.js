"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateBackgroundRepeatPath = exports.getBackgroundValueForIndex = exports.calculateBackgroundSize = exports.isAuto = exports.calculateBackgroundRendering = exports.calculateBackgroundPaintingArea = exports.calculateBackgroundPositioningArea = void 0;
var background_size_1 = require("../css/property-descriptors/background-size");
var vector_1 = require("./vector");
var length_percentage_1 = require("../css/types/length-percentage");
var parser_1 = require("../css/syntax/parser");
var box_sizing_1 = require("./box-sizing");
var calculateBackgroundPositioningArea = function (backgroundOrigin, element) {
    if (backgroundOrigin === 0 /* BORDER_BOX */) {
        return element.bounds;
    }
    if (backgroundOrigin === 2 /* CONTENT_BOX */) {
        return box_sizing_1.contentBox(element);
    }
    return box_sizing_1.paddingBox(element);
};
exports.calculateBackgroundPositioningArea = calculateBackgroundPositioningArea;
var calculateBackgroundPaintingArea = function (backgroundClip, element) {
    if (backgroundClip === 0 /* BORDER_BOX */) {
        return element.bounds;
    }
    if (backgroundClip === 2 /* CONTENT_BOX */) {
        return box_sizing_1.contentBox(element);
    }
    return box_sizing_1.paddingBox(element);
};
exports.calculateBackgroundPaintingArea = calculateBackgroundPaintingArea;
var calculateBackgroundRendering = function (container, index, intrinsicSize) {
    var backgroundPositioningArea = exports.calculateBackgroundPositioningArea(exports.getBackgroundValueForIndex(container.styles.backgroundOrigin, index), container);
    var backgroundPaintingArea = exports.calculateBackgroundPaintingArea(exports.getBackgroundValueForIndex(container.styles.backgroundClip, index), container);
    var backgroundImageSize = exports.calculateBackgroundSize(exports.getBackgroundValueForIndex(container.styles.backgroundSize, index), intrinsicSize, backgroundPositioningArea);
    var sizeWidth = backgroundImageSize[0], sizeHeight = backgroundImageSize[1];
    var position = length_percentage_1.getAbsoluteValueForTuple(exports.getBackgroundValueForIndex(container.styles.backgroundPosition, index), backgroundPositioningArea.width - sizeWidth, backgroundPositioningArea.height - sizeHeight);
    var path = exports.calculateBackgroundRepeatPath(exports.getBackgroundValueForIndex(container.styles.backgroundRepeat, index), position, backgroundImageSize, backgroundPositioningArea, backgroundPaintingArea);
    var offsetX = Math.round(backgroundPositioningArea.left + position[0]);
    var offsetY = Math.round(backgroundPositioningArea.top + position[1]);
    return [path, offsetX, offsetY, sizeWidth, sizeHeight];
};
exports.calculateBackgroundRendering = calculateBackgroundRendering;
var isAuto = function (token) { return parser_1.isIdentToken(token) && token.value === background_size_1.BACKGROUND_SIZE.AUTO; };
exports.isAuto = isAuto;
var hasIntrinsicValue = function (value) { return typeof value === 'number'; };
var calculateBackgroundSize = function (size, _a, bounds) {
    var intrinsicWidth = _a[0], intrinsicHeight = _a[1], intrinsicProportion = _a[2];
    var first = size[0], second = size[1];
    if (!first) {
        return [0, 0];
    }
    if (length_percentage_1.isLengthPercentage(first) && second && length_percentage_1.isLengthPercentage(second)) {
        return [length_percentage_1.getAbsoluteValue(first, bounds.width), length_percentage_1.getAbsoluteValue(second, bounds.height)];
    }
    var hasIntrinsicProportion = hasIntrinsicValue(intrinsicProportion);
    if (parser_1.isIdentToken(first) && (first.value === background_size_1.BACKGROUND_SIZE.CONTAIN || first.value === background_size_1.BACKGROUND_SIZE.COVER)) {
        if (hasIntrinsicValue(intrinsicProportion)) {
            var targetRatio = bounds.width / bounds.height;
            return targetRatio < intrinsicProportion !== (first.value === background_size_1.BACKGROUND_SIZE.COVER)
                ? [bounds.width, bounds.width / intrinsicProportion]
                : [bounds.height * intrinsicProportion, bounds.height];
        }
        return [bounds.width, bounds.height];
    }
    var hasIntrinsicWidth = hasIntrinsicValue(intrinsicWidth);
    var hasIntrinsicHeight = hasIntrinsicValue(intrinsicHeight);
    var hasIntrinsicDimensions = hasIntrinsicWidth || hasIntrinsicHeight;
    // If the background-size is auto or auto auto:
    if (exports.isAuto(first) && (!second || exports.isAuto(second))) {
        // If the image has both horizontal and vertical intrinsic dimensions, it's rendered at that size.
        if (hasIntrinsicWidth && hasIntrinsicHeight) {
            return [intrinsicWidth, intrinsicHeight];
        }
        // If the image has no intrinsic dimensions and has no intrinsic proportions,
        // it's rendered at the size of the background positioning area.
        if (!hasIntrinsicProportion && !hasIntrinsicDimensions) {
            return [bounds.width, bounds.height];
        }
        // TODO If the image has no intrinsic dimensions but has intrinsic proportions, it's rendered as if contain had been specified instead.
        // If the image has only one intrinsic dimension and has intrinsic proportions, it's rendered at the size corresponding to that one dimension.
        // The other dimension is computed using the specified dimension and the intrinsic proportions.
        if (hasIntrinsicDimensions && hasIntrinsicProportion) {
            var width_1 = hasIntrinsicWidth
                ? intrinsicWidth
                : intrinsicHeight * intrinsicProportion;
            var height_1 = hasIntrinsicHeight
                ? intrinsicHeight
                : intrinsicWidth / intrinsicProportion;
            return [width_1, height_1];
        }
        // If the image has only one intrinsic dimension but has no intrinsic proportions,
        // it's rendered using the specified dimension and the other dimension of the background positioning area.
        var width_2 = hasIntrinsicWidth ? intrinsicWidth : bounds.width;
        var height_2 = hasIntrinsicHeight ? intrinsicHeight : bounds.height;
        return [width_2, height_2];
    }
    // If the image has intrinsic proportions, it's stretched to the specified dimension.
    // The unspecified dimension is computed using the specified dimension and the intrinsic proportions.
    if (hasIntrinsicProportion) {
        var width_3 = 0;
        var height_3 = 0;
        if (length_percentage_1.isLengthPercentage(first)) {
            width_3 = length_percentage_1.getAbsoluteValue(first, bounds.width);
        }
        else if (length_percentage_1.isLengthPercentage(second)) {
            height_3 = length_percentage_1.getAbsoluteValue(second, bounds.height);
        }
        if (exports.isAuto(first)) {
            width_3 = height_3 * intrinsicProportion;
        }
        else if (!second || exports.isAuto(second)) {
            height_3 = width_3 / intrinsicProportion;
        }
        return [width_3, height_3];
    }
    // If the image has no intrinsic proportions, it's stretched to the specified dimension.
    // The unspecified dimension is computed using the image's corresponding intrinsic dimension,
    // if there is one. If there is no such intrinsic dimension,
    // it becomes the corresponding dimension of the background positioning area.
    var width = null;
    var height = null;
    if (length_percentage_1.isLengthPercentage(first)) {
        width = length_percentage_1.getAbsoluteValue(first, bounds.width);
    }
    else if (second && length_percentage_1.isLengthPercentage(second)) {
        height = length_percentage_1.getAbsoluteValue(second, bounds.height);
    }
    if (width !== null && (!second || exports.isAuto(second))) {
        height =
            hasIntrinsicWidth && hasIntrinsicHeight
                ? (width / intrinsicWidth) * intrinsicHeight
                : bounds.height;
    }
    if (height !== null && exports.isAuto(first)) {
        width =
            hasIntrinsicWidth && hasIntrinsicHeight
                ? (height / intrinsicHeight) * intrinsicWidth
                : bounds.width;
    }
    if (width !== null && height !== null) {
        return [width, height];
    }
    throw new Error("Unable to calculate background-size for element");
};
exports.calculateBackgroundSize = calculateBackgroundSize;
var getBackgroundValueForIndex = function (values, index) {
    var value = values[index];
    if (typeof value === 'undefined') {
        return values[0];
    }
    return value;
};
exports.getBackgroundValueForIndex = getBackgroundValueForIndex;
var calculateBackgroundRepeatPath = function (repeat, _a, _b, backgroundPositioningArea, backgroundPaintingArea) {
    var x = _a[0], y = _a[1];
    var width = _b[0], height = _b[1];
    switch (repeat) {
        case 2 /* REPEAT_X */:
            return [
                new vector_1.Vector(Math.round(backgroundPositioningArea.left), Math.round(backgroundPositioningArea.top + y)),
                new vector_1.Vector(Math.round(backgroundPositioningArea.left + backgroundPositioningArea.width), Math.round(backgroundPositioningArea.top + y)),
                new vector_1.Vector(Math.round(backgroundPositioningArea.left + backgroundPositioningArea.width), Math.round(height + backgroundPositioningArea.top + y)),
                new vector_1.Vector(Math.round(backgroundPositioningArea.left), Math.round(height + backgroundPositioningArea.top + y))
            ];
        case 3 /* REPEAT_Y */:
            return [
                new vector_1.Vector(Math.round(backgroundPositioningArea.left + x), Math.round(backgroundPositioningArea.top)),
                new vector_1.Vector(Math.round(backgroundPositioningArea.left + x + width), Math.round(backgroundPositioningArea.top)),
                new vector_1.Vector(Math.round(backgroundPositioningArea.left + x + width), Math.round(backgroundPositioningArea.height + backgroundPositioningArea.top)),
                new vector_1.Vector(Math.round(backgroundPositioningArea.left + x), Math.round(backgroundPositioningArea.height + backgroundPositioningArea.top))
            ];
        case 1 /* NO_REPEAT */:
            return [
                new vector_1.Vector(Math.round(backgroundPositioningArea.left + x), Math.round(backgroundPositioningArea.top + y)),
                new vector_1.Vector(Math.round(backgroundPositioningArea.left + x + width), Math.round(backgroundPositioningArea.top + y)),
                new vector_1.Vector(Math.round(backgroundPositioningArea.left + x + width), Math.round(backgroundPositioningArea.top + y + height)),
                new vector_1.Vector(Math.round(backgroundPositioningArea.left + x), Math.round(backgroundPositioningArea.top + y + height))
            ];
        default:
            return [
                new vector_1.Vector(Math.round(backgroundPaintingArea.left), Math.round(backgroundPaintingArea.top)),
                new vector_1.Vector(Math.round(backgroundPaintingArea.left + backgroundPaintingArea.width), Math.round(backgroundPaintingArea.top)),
                new vector_1.Vector(Math.round(backgroundPaintingArea.left + backgroundPaintingArea.width), Math.round(backgroundPaintingArea.height + backgroundPaintingArea.top)),
                new vector_1.Vector(Math.round(backgroundPaintingArea.left), Math.round(backgroundPaintingArea.height + backgroundPaintingArea.top))
            ];
    }
};
exports.calculateBackgroundRepeatPath = calculateBackgroundRepeatPath;
//# sourceMappingURL=background.js.map