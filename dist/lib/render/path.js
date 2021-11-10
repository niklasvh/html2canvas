"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformPath = exports.equalPath = void 0;
var equalPath = function (a, b) {
    if (a.length === b.length) {
        return a.some(function (v, i) { return v === b[i]; });
    }
    return false;
};
exports.equalPath = equalPath;
var transformPath = function (path, deltaX, deltaY, deltaW, deltaH) {
    return path.map(function (point, index) {
        switch (index) {
            case 0:
                return point.add(deltaX, deltaY);
            case 1:
                return point.add(deltaX + deltaW, deltaY);
            case 2:
                return point.add(deltaX + deltaW, deltaY + deltaH);
            case 3:
                return point.add(deltaX, deltaY + deltaH);
        }
        return point;
    });
};
exports.transformPath = transformPath;
//# sourceMappingURL=path.js.map