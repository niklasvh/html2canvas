"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = exports.Logger = void 0;
var Logger = /** @class */ (function () {
    function Logger() {
    }
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    Logger.prototype.debug = function () { };
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    Logger.create = function () { };
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    Logger.destroy = function () { };
    Logger.getInstance = function () {
        return exports.logger;
    };
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    Logger.prototype.info = function () { };
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    Logger.prototype.error = function () { };
    return Logger;
}());
exports.Logger = Logger;
exports.logger = new Logger();
//# sourceMappingURL=logger.js.map