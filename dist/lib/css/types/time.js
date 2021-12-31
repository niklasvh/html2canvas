"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.time = void 0;
exports.time = {
    name: 'time',
    parse: function (_context, value) {
        if (value.type === 15 /* DIMENSION_TOKEN */) {
            switch (value.unit.toLowerCase()) {
                case 's':
                    return 1000 * value.number;
                case 'ms':
                    return value.number;
            }
        }
        throw new Error("Unsupported time type");
    }
};
//# sourceMappingURL=time.js.map