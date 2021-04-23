"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Logger = /** @class */ (function () {
    function Logger() {
    }
    Logger.prototype.debug = function () { };
    Logger.create = function () { };
    Logger.destroy = function () { };
    Logger.getInstance = function () {
        return logger;
    };
    Logger.prototype.info = function () { };
    Logger.prototype.error = function () { };
    return Logger;
}());
exports.Logger = Logger;
var logger = new Logger();
//# sourceMappingURL=logger.js.map