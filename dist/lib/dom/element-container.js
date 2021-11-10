"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ElementContainer = void 0;
var index_1 = require("../css/index");
var bounds_1 = require("../css/layout/bounds");
var node_parser_1 = require("./node-parser");
var debugger_1 = require("../core/debugger");
var ElementContainer = /** @class */ (function () {
    function ElementContainer(context, element) {
        this.context = context;
        this.textNodes = [];
        this.elements = [];
        this.flags = 0;
        if (debugger_1.isDebugging(element, 3 /* PARSE */)) {
            debugger;
        }
        this.styles = new index_1.CSSParsedDeclaration(context, window.getComputedStyle(element, null));
        if (node_parser_1.isHTMLElementNode(element)) {
            if (this.styles.animationDuration.some(function (duration) { return duration > 0; })) {
                element.style.animationDuration = '0s';
            }
            if (this.styles.transform !== null) {
                // getBoundingClientRect takes transforms into account
                element.style.transform = 'none';
            }
        }
        this.bounds = bounds_1.parseBounds(this.context, element);
        if (debugger_1.isDebugging(element, 4 /* RENDER */)) {
            this.flags |= 16 /* DEBUG_RENDER */;
        }
    }
    return ElementContainer;
}());
exports.ElementContainer = ElementContainer;
//# sourceMappingURL=element-container.js.map