"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.textTransform = void 0;
exports.textTransform = {
    name: 'text-transform',
    initialValue: 'none',
    prefix: false,
    type: 2 /* IDENT_VALUE */,
    parse: function (_context, textTransform) {
        switch (textTransform) {
            case 'uppercase':
                return 2 /* UPPERCASE */;
            case 'lowercase':
                return 1 /* LOWERCASE */;
            case 'capitalize':
                return 3 /* CAPITALIZE */;
        }
        return 0 /* NONE */;
    }
};
//# sourceMappingURL=text-transform.js.map