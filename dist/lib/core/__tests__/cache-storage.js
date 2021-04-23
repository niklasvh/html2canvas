"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var assert_1 = require("assert");
var features_1 = require("../features");
var cache_storage_1 = require("../cache-storage");
var logger_1 = require("../logger");
var proxy = 'http://example.com/proxy';
var createMockContext = function (origin, opts) {
    if (opts === void 0) { opts = {}; }
    var context = {
        location: {
            href: origin
        },
        document: {
            createElement: function (_name) {
                var _href = '';
                return {
                    set href(value) {
                        _href = value;
                    },
                    get href() {
                        return _href;
                    },
                    get protocol() {
                        return new URL(_href).protocol;
                    },
                    get hostname() {
                        return new URL(_href).hostname;
                    },
                    get port() {
                        return new URL(_href).port;
                    }
                };
            }
        }
    };
    cache_storage_1.CacheStorage.setContext(context);
    logger_1.Logger.create({ id: 'test', enabled: false });
    return cache_storage_1.CacheStorage.create('test', __assign({ imageTimeout: 0, useCORS: false, allowTaint: false, proxy: proxy }, opts));
};
var images = [];
var xhr = [];
var sleep = function (timeout) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
    switch (_a.label) {
        case 0: return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, timeout); })];
        case 1: return [2 /*return*/, _a.sent()];
    }
}); }); };
var ImageMock = /** @class */ (function () {
    function ImageMock() {
        images.push(this);
    }
    return ImageMock;
}());
var XMLHttpRequestMock = /** @class */ (function () {
    function XMLHttpRequestMock() {
        this.sent = false;
        this.status = 500;
        this.timeout = 5000;
        xhr.push(this);
    }
    XMLHttpRequestMock.prototype.load = function (status, response) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.response = response;
                        this.status = status;
                        if (this.onload) {
                            this.onload();
                        }
                        return [4 /*yield*/, sleep(0)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    XMLHttpRequestMock.prototype.open = function (method, url) {
        this.method = method;
        this.url = url;
    };
    XMLHttpRequestMock.prototype.send = function () {
        this.sent = true;
    };
    return XMLHttpRequestMock;
}());
Object.defineProperty(global, 'Image', { value: ImageMock, writable: true });
Object.defineProperty(global, 'XMLHttpRequest', {
    value: XMLHttpRequestMock,
    writable: true
});
var setFeatures = function (opts) {
    if (opts === void 0) { opts = {}; }
    var defaults = {
        SUPPORT_SVG_DRAWING: true,
        SUPPORT_CORS_IMAGES: true,
        SUPPORT_CORS_XHR: true,
        SUPPORT_RESPONSE_TYPE: false
    };
    Object.keys(defaults).forEach(function (key) {
        Object.defineProperty(features_1.FEATURES, key, {
            value: typeof opts[key] === 'boolean' ? opts[key] : defaults[key],
            writable: true
        });
    });
};
describe('cache-storage', function () {
    beforeEach(function () { return setFeatures(); });
    afterEach(function () {
        xhr.splice(0, xhr.length);
        images.splice(0, images.length);
    });
    it('addImage adds images to cache', function () { return __awaiter(_this, void 0, void 0, function () {
        var cache;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cache = createMockContext('http://example.com', { proxy: null });
                    return [4 /*yield*/, cache.addImage('http://example.com/test.jpg')];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, cache.addImage('http://example.com/test2.jpg')];
                case 2:
                    _a.sent();
                    assert_1.deepStrictEqual(images.length, 2);
                    assert_1.deepStrictEqual(images[0].src, 'http://example.com/test.jpg');
                    assert_1.deepStrictEqual(images[1].src, 'http://example.com/test2.jpg');
                    return [2 /*return*/];
            }
        });
    }); });
    it('addImage should not add duplicate entries', function () { return __awaiter(_this, void 0, void 0, function () {
        var cache;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cache = createMockContext('http://example.com');
                    return [4 /*yield*/, cache.addImage('http://example.com/test.jpg')];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, cache.addImage('http://example.com/test.jpg')];
                case 2:
                    _a.sent();
                    assert_1.deepStrictEqual(images.length, 1);
                    assert_1.deepStrictEqual(images[0].src, 'http://example.com/test.jpg');
                    return [2 /*return*/];
            }
        });
    }); });
    describe('svg', function () {
        it('should add svg images correctly', function () { return __awaiter(_this, void 0, void 0, function () {
            var cache;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cache = createMockContext('http://example.com');
                        return [4 /*yield*/, cache.addImage('http://example.com/test.svg')];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, cache.addImage('http://example.com/test2.svg')];
                    case 2:
                        _a.sent();
                        assert_1.deepStrictEqual(images.length, 2);
                        assert_1.deepStrictEqual(images[0].src, 'http://example.com/test.svg');
                        assert_1.deepStrictEqual(images[1].src, 'http://example.com/test2.svg');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should omit svg images if not supported', function () { return __awaiter(_this, void 0, void 0, function () {
            var cache;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        setFeatures({ SUPPORT_SVG_DRAWING: false });
                        cache = createMockContext('http://example.com');
                        return [4 /*yield*/, cache.addImage('http://example.com/test.svg')];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, cache.addImage('http://example.com/test2.svg')];
                    case 2:
                        _a.sent();
                        assert_1.deepStrictEqual(images.length, 0);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('cross-origin', function () {
        it('addImage should not add images it cannot load/render', function () { return __awaiter(_this, void 0, void 0, function () {
            var cache;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cache = createMockContext('http://example.com', {
                            proxy: undefined
                        });
                        return [4 /*yield*/, cache.addImage('http://html2canvas.hertzen.com/test.jpg')];
                    case 1:
                        _a.sent();
                        assert_1.deepStrictEqual(images.length, 0);
                        return [2 /*return*/];
                }
            });
        }); });
        it('addImage should add images if tainting enabled', function () { return __awaiter(_this, void 0, void 0, function () {
            var cache;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cache = createMockContext('http://example.com', {
                            allowTaint: true,
                            proxy: undefined
                        });
                        return [4 /*yield*/, cache.addImage('http://html2canvas.hertzen.com/test.jpg')];
                    case 1:
                        _a.sent();
                        assert_1.deepStrictEqual(images.length, 1);
                        assert_1.deepStrictEqual(images[0].src, 'http://html2canvas.hertzen.com/test.jpg');
                        assert_1.deepStrictEqual(images[0].crossOrigin, undefined);
                        return [2 /*return*/];
                }
            });
        }); });
        it('addImage should add images if cors enabled', function () { return __awaiter(_this, void 0, void 0, function () {
            var cache;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cache = createMockContext('http://example.com', { useCORS: true });
                        return [4 /*yield*/, cache.addImage('http://html2canvas.hertzen.com/test.jpg')];
                    case 1:
                        _a.sent();
                        assert_1.deepStrictEqual(images.length, 1);
                        assert_1.deepStrictEqual(images[0].src, 'http://html2canvas.hertzen.com/test.jpg');
                        assert_1.deepStrictEqual(images[0].crossOrigin, 'anonymous');
                        return [2 /*return*/];
                }
            });
        }); });
        it('addImage should not add images if cors enabled but not supported', function () { return __awaiter(_this, void 0, void 0, function () {
            var cache;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        setFeatures({ SUPPORT_CORS_IMAGES: false });
                        cache = createMockContext('http://example.com', {
                            useCORS: true,
                            proxy: undefined
                        });
                        return [4 /*yield*/, cache.addImage('http://html2canvas.hertzen.com/test.jpg')];
                    case 1:
                        _a.sent();
                        assert_1.deepStrictEqual(images.length, 0);
                        return [2 /*return*/];
                }
            });
        }); });
        it('addImage should not add images to proxy if cors enabled', function () { return __awaiter(_this, void 0, void 0, function () {
            var cache;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cache = createMockContext('http://example.com', { useCORS: true });
                        return [4 /*yield*/, cache.addImage('http://html2canvas.hertzen.com/test.jpg')];
                    case 1:
                        _a.sent();
                        assert_1.deepStrictEqual(images.length, 1);
                        assert_1.deepStrictEqual(images[0].src, 'http://html2canvas.hertzen.com/test.jpg');
                        assert_1.deepStrictEqual(images[0].crossOrigin, 'anonymous');
                        return [2 /*return*/];
                }
            });
        }); });
        it('addImage should use proxy ', function () { return __awaiter(_this, void 0, void 0, function () {
            var cache;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cache = createMockContext('http://example.com');
                        return [4 /*yield*/, cache.addImage('http://html2canvas.hertzen.com/test.jpg')];
                    case 1:
                        _a.sent();
                        assert_1.deepStrictEqual(xhr.length, 1);
                        assert_1.deepStrictEqual(xhr[0].url, proxy + "?url=" + encodeURIComponent('http://html2canvas.hertzen.com/test.jpg') + "&responseType=text");
                        return [4 /*yield*/, xhr[0].load(200, '<data response>')];
                    case 2:
                        _a.sent();
                        assert_1.deepStrictEqual(images.length, 1);
                        assert_1.deepStrictEqual(images[0].src, '<data response>');
                        return [2 /*return*/];
                }
            });
        }); });
        it('proxy should respect imageTimeout', function () { return __awaiter(_this, void 0, void 0, function () {
            var cache, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cache = createMockContext('http://example.com', {
                            imageTimeout: 10
                        });
                        return [4 /*yield*/, cache.addImage('http://html2canvas.hertzen.com/test.jpg')];
                    case 1:
                        _a.sent();
                        assert_1.deepStrictEqual(xhr.length, 1);
                        assert_1.deepStrictEqual(xhr[0].url, proxy + "?url=" + encodeURIComponent('http://html2canvas.hertzen.com/test.jpg') + "&responseType=text");
                        assert_1.deepStrictEqual(xhr[0].timeout, 10);
                        if (xhr[0].ontimeout) {
                            xhr[0].ontimeout();
                        }
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, cache.match('http://html2canvas.hertzen.com/test.jpg')];
                    case 3:
                        _a.sent();
                        assert_1.fail('Expected result to timeout');
                        return [3 /*break*/, 5];
                    case 4:
                        e_1 = _a.sent();
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        }); });
    });
    it('match should return cache entry', function () { return __awaiter(_this, void 0, void 0, function () {
        var cache, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cache = createMockContext('http://example.com');
                    return [4 /*yield*/, cache.addImage('http://example.com/test.jpg')];
                case 1:
                    _a.sent();
                    if (images[0].onload) {
                        images[0].onload();
                    }
                    return [4 /*yield*/, cache.match('http://example.com/test.jpg')];
                case 2:
                    response = _a.sent();
                    assert_1.deepStrictEqual(response.src, 'http://example.com/test.jpg');
                    return [2 /*return*/];
            }
        });
    }); });
    it('image should respect imageTimeout', function () { return __awaiter(_this, void 0, void 0, function () {
        var cache, e_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cache = createMockContext('http://example.com', { imageTimeout: 10 });
                    cache.addImage('http://example.com/test.jpg');
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, cache.match('http://example.com/test.jpg')];
                case 2:
                    _a.sent();
                    assert_1.fail('Expected result to timeout');
                    return [3 /*break*/, 4];
                case 3:
                    e_2 = _a.sent();
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=cache-storage.js.map