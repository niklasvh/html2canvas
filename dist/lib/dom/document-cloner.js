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
Object.defineProperty(exports, "__esModule", { value: true });
var node_parser_1 = require("./node-parser");
var logger_1 = require("../core/logger");
var parser_1 = require("../css/syntax/parser");
var tokenizer_1 = require("../css/syntax/tokenizer");
var counter_1 = require("../css/types/functions/counter");
var list_style_type_1 = require("../css/property-descriptors/list-style-type");
var index_1 = require("../css/index");
var quotes_1 = require("../css/property-descriptors/quotes");
var IGNORE_ATTRIBUTE = 'data-html2canvas-ignore';
var DocumentCloner = /** @class */ (function () {
    function DocumentCloner(element, options) {
        this.options = options;
        this.scrolledElements = [];
        this.referenceElement = element;
        this.counters = new counter_1.CounterState();
        this.quoteDepth = 0;
        if (!element.ownerDocument) {
            throw new Error('Cloned element does not have an owner document');
        }
        this.documentElement = this.cloneNode(element.ownerDocument.documentElement);
    }
    DocumentCloner.prototype.toIFrame = function (ownerDocument, windowSize) {
        var _this = this;
        var iframe = createIFrameContainer(ownerDocument, windowSize);
        if (!iframe.contentWindow) {
            return Promise.reject("Unable to find iframe window");
        }
        var scrollX = ownerDocument.defaultView.pageXOffset;
        var scrollY = ownerDocument.defaultView.pageYOffset;
        var cloneWindow = iframe.contentWindow;
        var documentClone = cloneWindow.document;
        /* Chrome doesn't detect relative background-images assigned in inline <style> sheets when fetched through getComputedStyle
         if window url is about:blank, we can assign the url to current by writing onto the document
         */
        var iframeLoad = iframeLoader(iframe).then(function () { return __awaiter(_this, void 0, void 0, function () {
            var onclone;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.scrolledElements.forEach(restoreNodeScroll);
                        if (cloneWindow) {
                            cloneWindow.scrollTo(windowSize.left, windowSize.top);
                            if (/(iPad|iPhone|iPod)/g.test(navigator.userAgent) &&
                                (cloneWindow.scrollY !== windowSize.top || cloneWindow.scrollX !== windowSize.left)) {
                                documentClone.documentElement.style.top = -windowSize.top + 'px';
                                documentClone.documentElement.style.left = -windowSize.left + 'px';
                                documentClone.documentElement.style.position = 'absolute';
                            }
                        }
                        onclone = this.options.onclone;
                        if (typeof this.clonedReferenceElement === 'undefined') {
                            return [2 /*return*/, Promise.reject("Error finding the " + this.referenceElement.nodeName + " in the cloned document")];
                        }
                        if (!(documentClone.fonts && documentClone.fonts.ready)) return [3 /*break*/, 2];
                        return [4 /*yield*/, documentClone.fonts.ready];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        if (typeof onclone === 'function') {
                            return [2 /*return*/, Promise.resolve()
                                    .then(function () { return onclone(documentClone); })
                                    .then(function () { return iframe; })];
                        }
                        return [2 /*return*/, iframe];
                }
            });
        }); });
        documentClone.open();
        documentClone.write(serializeDoctype(document.doctype) + "<html></html>");
        // Chrome scrolls the parent document for some reason after the write to the cloned window???
        restoreOwnerScroll(this.referenceElement.ownerDocument, scrollX, scrollY);
        documentClone.replaceChild(documentClone.adoptNode(this.documentElement), documentClone.documentElement);
        documentClone.close();
        return iframeLoad;
    };
    DocumentCloner.prototype.createElementClone = function (node) {
        if (node_parser_1.isCanvasElement(node)) {
            return this.createCanvasClone(node);
        }
        /*
        if (isIFrameElement(node)) {
            return this.createIFrameClone(node);
        }
*/
        if (node_parser_1.isStyleElement(node)) {
            return this.createStyleClone(node);
        }
        var clone = node.cloneNode(false);
        // @ts-ignore
        if (node_parser_1.isImageElement(clone) && clone.loading === 'lazy') {
            // @ts-ignore
            clone.loading = 'eager';
        }
        return clone;
    };
    DocumentCloner.prototype.createStyleClone = function (node) {
        try {
            var sheet = node.sheet;
            if (sheet && sheet.cssRules) {
                var css = [].slice.call(sheet.cssRules, 0).reduce(function (css, rule) {
                    if (rule && typeof rule.cssText === 'string') {
                        return css + rule.cssText;
                    }
                    return css;
                }, '');
                var style = node.cloneNode(false);
                style.textContent = css;
                return style;
            }
        }
        catch (e) {
            // accessing node.sheet.cssRules throws a DOMException
            logger_1.Logger.getInstance(this.options.id).error('Unable to access cssRules property', e);
            if (e.name !== 'SecurityError') {
                throw e;
            }
        }
        return node.cloneNode(false);
    };
    DocumentCloner.prototype.createCanvasClone = function (canvas) {
        if (this.options.inlineImages && canvas.ownerDocument) {
            var img = canvas.ownerDocument.createElement('img');
            try {
                img.src = canvas.toDataURL();
                return img;
            }
            catch (e) {
                logger_1.Logger.getInstance(this.options.id).info("Unable to clone canvas contents, canvas is tainted");
            }
        }
        var clonedCanvas = canvas.cloneNode(false);
        try {
            clonedCanvas.width = canvas.width;
            clonedCanvas.height = canvas.height;
            var ctx = canvas.getContext('2d');
            var clonedCtx = clonedCanvas.getContext('2d');
            if (clonedCtx) {
                if (ctx) {
                    clonedCtx.putImageData(ctx.getImageData(0, 0, canvas.width, canvas.height), 0, 0);
                }
                else {
                    clonedCtx.drawImage(canvas, 0, 0);
                }
            }
            return clonedCanvas;
        }
        catch (e) { }
        return clonedCanvas;
    };
    /*
    createIFrameClone(iframe: HTMLIFrameElement) {
        const tempIframe = <HTMLIFrameElement>iframe.cloneNode(false);
        const iframeKey = generateIframeKey();
        tempIframe.setAttribute('data-html2canvas-internal-iframe-key', iframeKey);

        const {width, height} = parseBounds(iframe);

        this.resourceLoader.cache[iframeKey] = getIframeDocumentElement(iframe, this.options)
            .then(documentElement => {
                return this.renderer(
                    documentElement,
                    {
                        allowTaint: this.options.allowTaint,
                        backgroundColor: '#ffffff',
                        canvas: null,
                        imageTimeout: this.options.imageTimeout,
                        logging: this.options.logging,
                        proxy: this.options.proxy,
                        removeContainer: this.options.removeContainer,
                        scale: this.options.scale,
                        foreignObjectRendering: this.options.foreignObjectRendering,
                        useCORS: this.options.useCORS,
                        target: new CanvasRenderer(),
                        width,
                        height,
                        x: 0,
                        y: 0,
                        windowWidth: documentElement.ownerDocument.defaultView.innerWidth,
                        windowHeight: documentElement.ownerDocument.defaultView.innerHeight,
                        scrollX: documentElement.ownerDocument.defaultView.pageXOffset,
                        scrollY: documentElement.ownerDocument.defaultView.pageYOffset
                    },
                );
            })
            .then(
                (canvas: HTMLCanvasElement) =>
                    new Promise((resolve, reject) => {
                        const iframeCanvas = document.createElement('img');
                        iframeCanvas.onload = () => resolve(canvas);
                        iframeCanvas.onerror = (event) => {
                            // Empty iframes may result in empty "data:," URLs, which are invalid from the <img>'s point of view
                            // and instead of `onload` cause `onerror` and unhandled rejection warnings
                            // https://github.com/niklasvh/html2canvas/issues/1502
                            iframeCanvas.src == 'data:,' ? resolve(canvas) : reject(event);
                        };
                        iframeCanvas.src = canvas.toDataURL();
                        if (tempIframe.parentNode && iframe.ownerDocument && iframe.ownerDocument.defaultView) {
                            tempIframe.parentNode.replaceChild(
                                copyCSSStyles(
                                    iframe.ownerDocument.defaultView.getComputedStyle(iframe),
                                    iframeCanvas
                                ),
                                tempIframe
                            );
                        }
                    })
            );
        return tempIframe;
    }
*/
    DocumentCloner.prototype.cloneNode = function (node) {
        if (node_parser_1.isTextNode(node)) {
            return document.createTextNode(node.data);
        }
        if (!node.ownerDocument) {
            return node.cloneNode(false);
        }
        var window = node.ownerDocument.defaultView;
        if (window && node_parser_1.isElementNode(node) && (node_parser_1.isHTMLElementNode(node) || node_parser_1.isSVGElementNode(node))) {
            var clone = this.createElementClone(node);
            var style = window.getComputedStyle(node);
            var styleBefore = window.getComputedStyle(node, ':before');
            var styleAfter = window.getComputedStyle(node, ':after');
            if (this.referenceElement === node && node_parser_1.isHTMLElementNode(clone)) {
                this.clonedReferenceElement = clone;
            }
            if (node_parser_1.isBodyElement(clone)) {
                createPseudoHideStyles(clone);
            }
            var counters = this.counters.parse(new index_1.CSSParsedCounterDeclaration(style));
            var before = this.resolvePseudoContent(node, clone, styleBefore, PseudoElementType.BEFORE);
            for (var child = node.firstChild; child; child = child.nextSibling) {
                if (!node_parser_1.isElementNode(child) ||
                    (!node_parser_1.isScriptElement(child) &&
                        !child.hasAttribute(IGNORE_ATTRIBUTE) &&
                        (typeof this.options.ignoreElements !== 'function' || !this.options.ignoreElements(child)))) {
                    if (!this.options.copyStyles || !node_parser_1.isElementNode(child) || !node_parser_1.isStyleElement(child)) {
                        clone.appendChild(this.cloneNode(child));
                    }
                }
            }
            if (before) {
                clone.insertBefore(before, clone.firstChild);
            }
            var after = this.resolvePseudoContent(node, clone, styleAfter, PseudoElementType.AFTER);
            if (after) {
                clone.appendChild(after);
            }
            this.counters.pop(counters);
            if (style && (this.options.copyStyles || node_parser_1.isSVGElementNode(node)) && !node_parser_1.isIFrameElement(node)) {
                exports.copyCSSStyles(style, clone);
            }
            //this.inlineAllImages(clone);
            if (node.scrollTop !== 0 || node.scrollLeft !== 0) {
                this.scrolledElements.push([clone, node.scrollLeft, node.scrollTop]);
            }
            if ((node_parser_1.isTextareaElement(node) || node_parser_1.isSelectElement(node)) &&
                (node_parser_1.isTextareaElement(clone) || node_parser_1.isSelectElement(clone))) {
                clone.value = node.value;
            }
            return clone;
        }
        return node.cloneNode(false);
    };
    DocumentCloner.prototype.resolvePseudoContent = function (node, clone, style, pseudoElt) {
        var _this = this;
        if (!style) {
            return;
        }
        var value = style.content;
        var document = clone.ownerDocument;
        if (!document || !value || value === 'none' || value === '-moz-alt-content' || style.display === 'none') {
            return;
        }
        this.counters.parse(new index_1.CSSParsedCounterDeclaration(style));
        var declaration = new index_1.CSSParsedPseudoDeclaration(style);
        var anonymousReplacedElement = document.createElement('html2canvaspseudoelement');
        exports.copyCSSStyles(style, anonymousReplacedElement);
        declaration.content.forEach(function (token) {
            if (token.type === tokenizer_1.TokenType.STRING_TOKEN) {
                anonymousReplacedElement.appendChild(document.createTextNode(token.value));
            }
            else if (token.type === tokenizer_1.TokenType.URL_TOKEN) {
                var img = document.createElement('img');
                img.src = token.value;
                img.style.opacity = '1';
                anonymousReplacedElement.appendChild(img);
            }
            else if (token.type === tokenizer_1.TokenType.FUNCTION) {
                if (token.name === 'attr') {
                    var attr = token.values.filter(parser_1.isIdentToken);
                    if (attr.length) {
                        anonymousReplacedElement.appendChild(document.createTextNode(node.getAttribute(attr[0].value) || ''));
                    }
                }
                else if (token.name === 'counter') {
                    var _a = token.values.filter(parser_1.nonFunctionArgSeparator), counter = _a[0], counterStyle = _a[1];
                    if (counter && parser_1.isIdentToken(counter)) {
                        var counterState = _this.counters.getCounterValue(counter.value);
                        var counterType = counterStyle && parser_1.isIdentToken(counterStyle)
                            ? list_style_type_1.listStyleType.parse(counterStyle.value)
                            : list_style_type_1.LIST_STYLE_TYPE.DECIMAL;
                        anonymousReplacedElement.appendChild(document.createTextNode(counter_1.createCounterText(counterState, counterType, false)));
                    }
                }
                else if (token.name === 'counters') {
                    var _b = token.values.filter(parser_1.nonFunctionArgSeparator), counter = _b[0], delim = _b[1], counterStyle = _b[2];
                    if (counter && parser_1.isIdentToken(counter)) {
                        var counterStates = _this.counters.getCounterValues(counter.value);
                        var counterType_1 = counterStyle && parser_1.isIdentToken(counterStyle)
                            ? list_style_type_1.listStyleType.parse(counterStyle.value)
                            : list_style_type_1.LIST_STYLE_TYPE.DECIMAL;
                        var separator = delim && delim.type === tokenizer_1.TokenType.STRING_TOKEN ? delim.value : '';
                        var text = counterStates
                            .map(function (value) { return counter_1.createCounterText(value, counterType_1, false); })
                            .join(separator);
                        anonymousReplacedElement.appendChild(document.createTextNode(text));
                    }
                }
                else {
                    //   console.log('FUNCTION_TOKEN', token);
                }
            }
            else if (token.type === tokenizer_1.TokenType.IDENT_TOKEN) {
                switch (token.value) {
                    case 'open-quote':
                        anonymousReplacedElement.appendChild(document.createTextNode(quotes_1.getQuote(declaration.quotes, _this.quoteDepth++, true)));
                        break;
                    case 'close-quote':
                        anonymousReplacedElement.appendChild(document.createTextNode(quotes_1.getQuote(declaration.quotes, --_this.quoteDepth, false)));
                        break;
                    default:
                        // safari doesn't parse string tokens correctly because of lack of quotes
                        anonymousReplacedElement.appendChild(document.createTextNode(token.value));
                }
            }
        });
        anonymousReplacedElement.className = PSEUDO_HIDE_ELEMENT_CLASS_BEFORE + " " + PSEUDO_HIDE_ELEMENT_CLASS_AFTER;
        var newClassName = pseudoElt === PseudoElementType.BEFORE
            ? " " + PSEUDO_HIDE_ELEMENT_CLASS_BEFORE
            : " " + PSEUDO_HIDE_ELEMENT_CLASS_AFTER;
        if (node_parser_1.isSVGElementNode(clone)) {
            clone.className.baseValue += newClassName;
        }
        else {
            clone.className += newClassName;
        }
        return anonymousReplacedElement;
    };
    DocumentCloner.destroy = function (container) {
        if (container.parentNode) {
            container.parentNode.removeChild(container);
            return true;
        }
        return false;
    };
    return DocumentCloner;
}());
exports.DocumentCloner = DocumentCloner;
var PseudoElementType;
(function (PseudoElementType) {
    PseudoElementType[PseudoElementType["BEFORE"] = 0] = "BEFORE";
    PseudoElementType[PseudoElementType["AFTER"] = 1] = "AFTER";
})(PseudoElementType || (PseudoElementType = {}));
var createIFrameContainer = function (ownerDocument, bounds) {
    var cloneIframeContainer = ownerDocument.createElement('iframe');
    cloneIframeContainer.className = 'html2canvas-container';
    cloneIframeContainer.style.visibility = 'hidden';
    cloneIframeContainer.style.position = 'fixed';
    cloneIframeContainer.style.left = '-10000px';
    cloneIframeContainer.style.top = '0px';
    cloneIframeContainer.style.border = '0';
    cloneIframeContainer.width = bounds.width.toString();
    cloneIframeContainer.height = bounds.height.toString();
    cloneIframeContainer.scrolling = 'no'; // ios won't scroll without it
    cloneIframeContainer.setAttribute(IGNORE_ATTRIBUTE, 'true');
    ownerDocument.body.appendChild(cloneIframeContainer);
    return cloneIframeContainer;
};
var iframeLoader = function (iframe) {
    return new Promise(function (resolve, reject) {
        var cloneWindow = iframe.contentWindow;
        if (!cloneWindow) {
            return reject("No window assigned for iframe");
        }
        var documentClone = cloneWindow.document;
        cloneWindow.onload = iframe.onload = documentClone.onreadystatechange = function () {
            cloneWindow.onload = iframe.onload = documentClone.onreadystatechange = null;
            var interval = setInterval(function () {
                if (documentClone.body.childNodes.length > 0 && documentClone.readyState === 'complete') {
                    clearInterval(interval);
                    resolve(iframe);
                }
            }, 50);
        };
    });
};
exports.copyCSSStyles = function (style, target) {
    // Edge does not provide value for cssText
    for (var i = style.length - 1; i >= 0; i--) {
        var property = style.item(i);
        // Safari shows pseudoelements if content is set
        if (property !== 'content') {
            target.style.setProperty(property, style.getPropertyValue(property));
        }
    }
    return target;
};
var serializeDoctype = function (doctype) {
    var str = '';
    if (doctype) {
        str += '<!DOCTYPE ';
        if (doctype.name) {
            str += doctype.name;
        }
        if (doctype.internalSubset) {
            str += doctype.internalSubset;
        }
        if (doctype.publicId) {
            str += "\"" + doctype.publicId + "\"";
        }
        if (doctype.systemId) {
            str += "\"" + doctype.systemId + "\"";
        }
        str += '>';
    }
    return str;
};
var restoreOwnerScroll = function (ownerDocument, x, y) {
    if (ownerDocument &&
        ownerDocument.defaultView &&
        (x !== ownerDocument.defaultView.pageXOffset || y !== ownerDocument.defaultView.pageYOffset)) {
        ownerDocument.defaultView.scrollTo(x, y);
    }
};
var restoreNodeScroll = function (_a) {
    var element = _a[0], x = _a[1], y = _a[2];
    element.scrollLeft = x;
    element.scrollTop = y;
};
var PSEUDO_BEFORE = ':before';
var PSEUDO_AFTER = ':after';
var PSEUDO_HIDE_ELEMENT_CLASS_BEFORE = '___html2canvas___pseudoelement_before';
var PSEUDO_HIDE_ELEMENT_CLASS_AFTER = '___html2canvas___pseudoelement_after';
var PSEUDO_HIDE_ELEMENT_STYLE = "{\n    content: \"\" !important;\n    display: none !important;\n}";
var createPseudoHideStyles = function (body) {
    createStyles(body, "." + PSEUDO_HIDE_ELEMENT_CLASS_BEFORE + PSEUDO_BEFORE + PSEUDO_HIDE_ELEMENT_STYLE + "\n         ." + PSEUDO_HIDE_ELEMENT_CLASS_AFTER + PSEUDO_AFTER + PSEUDO_HIDE_ELEMENT_STYLE);
};
var createStyles = function (body, styles) {
    var document = body.ownerDocument;
    if (document) {
        var style = document.createElement('style');
        style.textContent = styles;
        body.appendChild(style);
    }
};
//# sourceMappingURL=document-cloner.js.map