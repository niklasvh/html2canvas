"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDebugging = void 0;
var elementDebuggerAttribute = 'data-html2canvas-debug';
var getElementDebugType = function (element) {
    var attribute = element.getAttribute(elementDebuggerAttribute);
    switch (attribute) {
        case 'all':
            return 1 /* ALL */;
        case 'clone':
            return 2 /* CLONE */;
        case 'parse':
            return 3 /* PARSE */;
        case 'render':
            return 4 /* RENDER */;
        default:
            return 0 /* NONE */;
    }
};
var isDebugging = function (element, type) {
    var elementType = getElementDebugType(element);
    return elementType === 1 /* ALL */ || type === elementType;
};
exports.isDebugging = isDebugging;
//# sourceMappingURL=debugger.js.map