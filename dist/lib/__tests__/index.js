"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("../index");
var canvas_renderer_1 = require("../render/canvas/canvas-renderer");
var document_cloner_1 = require("../dom/document-cloner");
var color_1 = require("../css/types/color");
jest.mock('../core/logger');
jest.mock('../css/layout/bounds');
jest.mock('../dom/document-cloner');
jest.mock('../dom/node-parser', function () {
    return {
        isBodyElement: function () { return false; },
        isHTMLElement: function () { return false; },
        parseTree: jest.fn().mockImplementation(function () {
            return { styles: {} };
        })
    };
});
jest.mock('../render/stacking-context');
jest.mock('../render/canvas/canvas-renderer');
describe('html2canvas', function () {
    // eslint-disable-next-line @typescript-eslint/no-object-literal-type-assertion
    var element = {
        ownerDocument: {
            defaultView: {
                pageXOffset: 12,
                pageYOffset: 34
            }
        }
    };
    it('should render with an element', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    document_cloner_1.DocumentCloner.destroy = jest.fn().mockReturnValue(true);
                    return [4 /*yield*/, index_1.default(element)];
                case 1:
                    _a.sent();
                    expect(canvas_renderer_1.CanvasRenderer).toHaveBeenLastCalledWith(expect.objectContaining({
                        backgroundColor: 0xffffffff,
                        scale: 1,
                        height: 50,
                        width: 200,
                        x: 0,
                        y: 0,
                        scrollX: 12,
                        scrollY: 34,
                        canvas: undefined
                    }));
                    expect(document_cloner_1.DocumentCloner.destroy).toBeCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    it('should have transparent background with backgroundColor: null', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, index_1.default(element, { backgroundColor: null })];
                case 1:
                    _a.sent();
                    expect(canvas_renderer_1.CanvasRenderer).toHaveBeenLastCalledWith(expect.objectContaining({
                        backgroundColor: color_1.COLORS.TRANSPARENT
                    }));
                    return [2 /*return*/];
            }
        });
    }); });
    it('should use existing canvas when given as option', function () { return __awaiter(_this, void 0, void 0, function () {
        var canvas;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    canvas = {};
                    return [4 /*yield*/, index_1.default(element, { canvas: canvas })];
                case 1:
                    _a.sent();
                    expect(canvas_renderer_1.CanvasRenderer).toHaveBeenLastCalledWith(expect.objectContaining({
                        canvas: canvas
                    }));
                    return [2 /*return*/];
            }
        });
    }); });
    it('should not remove cloned window when removeContainer: false', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    document_cloner_1.DocumentCloner.destroy = jest.fn();
                    return [4 /*yield*/, index_1.default(element, { removeContainer: false })];
                case 1:
                    _a.sent();
                    expect(canvas_renderer_1.CanvasRenderer).toHaveBeenLastCalledWith(expect.objectContaining({
                        backgroundColor: 0xffffffff,
                        scale: 1,
                        height: 50,
                        width: 200,
                        x: 0,
                        y: 0,
                        scrollX: 12,
                        scrollY: 34,
                        canvas: undefined
                    }));
                    expect(document_cloner_1.DocumentCloner.destroy).not.toBeCalled();
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=index.js.map