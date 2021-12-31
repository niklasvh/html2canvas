"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateRadius = exports.calculateGradientDirection = exports.processColorStops = exports.parseColorStop = void 0;
var color_1 = require("../color");
var length_percentage_1 = require("../length-percentage");
var parseColorStop = function (context, args) {
    var color = color_1.color.parse(context, args[0]);
    var stop = args[1];
    return stop && length_percentage_1.isLengthPercentage(stop) ? { color: color, stop: stop } : { color: color, stop: null };
};
exports.parseColorStop = parseColorStop;
var processColorStops = function (stops, lineLength) {
    var first = stops[0];
    var last = stops[stops.length - 1];
    if (first.stop === null) {
        first.stop = length_percentage_1.ZERO_LENGTH;
    }
    if (last.stop === null) {
        last.stop = length_percentage_1.HUNDRED_PERCENT;
    }
    var processStops = [];
    var previous = 0;
    for (var i = 0; i < stops.length; i++) {
        var stop_1 = stops[i].stop;
        if (stop_1 !== null) {
            var absoluteValue = length_percentage_1.getAbsoluteValue(stop_1, lineLength);
            if (absoluteValue > previous) {
                processStops.push(absoluteValue);
            }
            else {
                processStops.push(previous);
            }
            previous = absoluteValue;
        }
        else {
            processStops.push(null);
        }
    }
    var gapBegin = null;
    for (var i = 0; i < processStops.length; i++) {
        var stop_2 = processStops[i];
        if (stop_2 === null) {
            if (gapBegin === null) {
                gapBegin = i;
            }
        }
        else if (gapBegin !== null) {
            var gapLength = i - gapBegin;
            var beforeGap = processStops[gapBegin - 1];
            var gapValue = (stop_2 - beforeGap) / (gapLength + 1);
            for (var g = 1; g <= gapLength; g++) {
                processStops[gapBegin + g - 1] = gapValue * g;
            }
            gapBegin = null;
        }
    }
    return stops.map(function (_a, i) {
        var color = _a.color;
        return { color: color, stop: Math.max(Math.min(1, processStops[i] / lineLength), 0) };
    });
};
exports.processColorStops = processColorStops;
var getAngleFromCorner = function (corner, width, height) {
    var centerX = width / 2;
    var centerY = height / 2;
    var x = length_percentage_1.getAbsoluteValue(corner[0], width) - centerX;
    var y = centerY - length_percentage_1.getAbsoluteValue(corner[1], height);
    return (Math.atan2(y, x) + Math.PI * 2) % (Math.PI * 2);
};
var calculateGradientDirection = function (angle, width, height) {
    var radian = typeof angle === 'number' ? angle : getAngleFromCorner(angle, width, height);
    var lineLength = Math.abs(width * Math.sin(radian)) + Math.abs(height * Math.cos(radian));
    var halfWidth = width / 2;
    var halfHeight = height / 2;
    var halfLineLength = lineLength / 2;
    var yDiff = Math.sin(radian - Math.PI / 2) * halfLineLength;
    var xDiff = Math.cos(radian - Math.PI / 2) * halfLineLength;
    return [lineLength, halfWidth - xDiff, halfWidth + xDiff, halfHeight - yDiff, halfHeight + yDiff];
};
exports.calculateGradientDirection = calculateGradientDirection;
var distance = function (a, b) { return Math.sqrt(a * a + b * b); };
var findCorner = function (width, height, x, y, closest) {
    var corners = [
        [0, 0],
        [0, height],
        [width, 0],
        [width, height]
    ];
    return corners.reduce(function (stat, corner) {
        var cx = corner[0], cy = corner[1];
        var d = distance(x - cx, y - cy);
        if (closest ? d < stat.optimumDistance : d > stat.optimumDistance) {
            return {
                optimumCorner: corner,
                optimumDistance: d
            };
        }
        return stat;
    }, {
        optimumDistance: closest ? Infinity : -Infinity,
        optimumCorner: null
    }).optimumCorner;
};
var calculateRadius = function (gradient, x, y, width, height) {
    var rx = 0;
    var ry = 0;
    switch (gradient.size) {
        case 0 /* CLOSEST_SIDE */:
            // The ending shape is sized so that that it exactly meets the side of the gradient box closest to the gradient’s center.
            // If the shape is an ellipse, it exactly meets the closest side in each dimension.
            if (gradient.shape === 0 /* CIRCLE */) {
                rx = ry = Math.min(Math.abs(x), Math.abs(x - width), Math.abs(y), Math.abs(y - height));
            }
            else if (gradient.shape === 1 /* ELLIPSE */) {
                rx = Math.min(Math.abs(x), Math.abs(x - width));
                ry = Math.min(Math.abs(y), Math.abs(y - height));
            }
            break;
        case 2 /* CLOSEST_CORNER */:
            // The ending shape is sized so that that it passes through the corner of the gradient box closest to the gradient’s center.
            // If the shape is an ellipse, the ending shape is given the same aspect-ratio it would have if closest-side were specified.
            if (gradient.shape === 0 /* CIRCLE */) {
                rx = ry = Math.min(distance(x, y), distance(x, y - height), distance(x - width, y), distance(x - width, y - height));
            }
            else if (gradient.shape === 1 /* ELLIPSE */) {
                // Compute the ratio ry/rx (which is to be the same as for "closest-side")
                var c = Math.min(Math.abs(y), Math.abs(y - height)) / Math.min(Math.abs(x), Math.abs(x - width));
                var _a = findCorner(width, height, x, y, true), cx = _a[0], cy = _a[1];
                rx = distance(cx - x, (cy - y) / c);
                ry = c * rx;
            }
            break;
        case 1 /* FARTHEST_SIDE */:
            // Same as closest-side, except the ending shape is sized based on the farthest side(s)
            if (gradient.shape === 0 /* CIRCLE */) {
                rx = ry = Math.max(Math.abs(x), Math.abs(x - width), Math.abs(y), Math.abs(y - height));
            }
            else if (gradient.shape === 1 /* ELLIPSE */) {
                rx = Math.max(Math.abs(x), Math.abs(x - width));
                ry = Math.max(Math.abs(y), Math.abs(y - height));
            }
            break;
        case 3 /* FARTHEST_CORNER */:
            // Same as closest-corner, except the ending shape is sized based on the farthest corner.
            // If the shape is an ellipse, the ending shape is given the same aspect ratio it would have if farthest-side were specified.
            if (gradient.shape === 0 /* CIRCLE */) {
                rx = ry = Math.max(distance(x, y), distance(x, y - height), distance(x - width, y), distance(x - width, y - height));
            }
            else if (gradient.shape === 1 /* ELLIPSE */) {
                // Compute the ratio ry/rx (which is to be the same as for "farthest-side")
                var c = Math.max(Math.abs(y), Math.abs(y - height)) / Math.max(Math.abs(x), Math.abs(x - width));
                var _b = findCorner(width, height, x, y, false), cx = _b[0], cy = _b[1];
                rx = distance(cx - x, (cy - y) / c);
                ry = c * rx;
            }
            break;
    }
    if (Array.isArray(gradient.size)) {
        rx = length_percentage_1.getAbsoluteValue(gradient.size[0], width);
        ry = gradient.size.length === 2 ? length_percentage_1.getAbsoluteValue(gradient.size[1], height) : rx;
    }
    return [rx, ry];
};
exports.calculateRadius = calculateRadius;
//# sourceMappingURL=gradient.js.map