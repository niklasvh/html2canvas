"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Context = void 0;
var logger_1 = require("./logger");
var cache_storage_1 = require("./cache-storage");
var Context = /** @class */ (function () {
    function Context(options, windowBounds) {
        var _a;
        this.windowBounds = windowBounds;
        this.instanceName = "#" + Context.instanceCount++;
        this.logger = new logger_1.Logger({ id: this.instanceName, enabled: options.logging });
        this.cache = (_a = options.cache) !== null && _a !== void 0 ? _a : new cache_storage_1.Cache(this, options);
    }
    Context.instanceCount = 1;
    return Context;
}());
exports.Context = Context;
//# sourceMappingURL=context.js.map