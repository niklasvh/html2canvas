"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.position = void 0;
exports.position = {
    name: 'position',
    initialValue: 'static',
    prefix: false,
    type: 2 /* IDENT_VALUE */,
    parse: function (_context, position) {
        switch (position) {
            case 'relative':
                return 1 /* RELATIVE */;
            case 'absolute':
                return 2 /* ABSOLUTE */;
            case 'fixed':
                return 3 /* FIXED */;
            case 'sticky':
                return 4 /* STICKY */;
        }
        return 0 /* STATIC */;
    }
};
//# sourceMappingURL=position.js.map