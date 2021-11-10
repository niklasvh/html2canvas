"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isBezierCurve = exports.BezierCurve = void 0;
var vector_1 = require("./vector");
var lerp = function (a, b, t) {
    return new vector_1.Vector(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t);
};
var BezierCurve = /** @class */ (function () {
    function BezierCurve(start, startControl, endControl, end) {
        this.type = 1 /* BEZIER_CURVE */;
        this.start = start;
        this.startControl = startControl;
        this.endControl = endControl;
        this.end = end;
    }
    BezierCurve.prototype.subdivide = function (t, firstHalf) {
        var ab = lerp(this.start, this.startControl, t);
        var bc = lerp(this.startControl, this.endControl, t);
        var cd = lerp(this.endControl, this.end, t);
        var abbc = lerp(ab, bc, t);
        var bccd = lerp(bc, cd, t);
        var dest = lerp(abbc, bccd, t);
        return firstHalf ? new BezierCurve(this.start, ab, abbc, dest) : new BezierCurve(dest, bccd, cd, this.end);
    };
    BezierCurve.prototype.add = function (deltaX, deltaY) {
        return new BezierCurve(this.start.add(deltaX, deltaY), this.startControl.add(deltaX, deltaY), this.endControl.add(deltaX, deltaY), this.end.add(deltaX, deltaY));
    };
    BezierCurve.prototype.reverse = function () {
        return new BezierCurve(this.end, this.endControl, this.startControl, this.start);
    };
    return BezierCurve;
}());
exports.BezierCurve = BezierCurve;
var isBezierCurve = function (path) { return path.type === 1 /* BEZIER_CURVE */; };
exports.isBezierCurve = isBezierCurve;
//# sourceMappingURL=bezier-curve.js.map