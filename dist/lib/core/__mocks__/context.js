"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Context = void 0;
var logger_1 = require("./logger");
var Context = /** @class */ (function () {
    function Context() {
        var _this = this;
        this.logger = logger_1.logger;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this._cache = {};
        this.cache = {
            addImage: jest.fn().mockImplementation(function (src) {
                var result = Promise.resolve();
                _this._cache[src] = result;
                return result;
            })
        };
    }
    return Context;
}());
exports.Context = Context;
//# sourceMappingURL=context.js.map