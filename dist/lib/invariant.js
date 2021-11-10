"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.invariant = void 0;
var invariant = function (assertion, error) {
    if (!assertion) {
        console.error(error);
    }
};
exports.invariant = invariant;
//# sourceMappingURL=invariant.js.map