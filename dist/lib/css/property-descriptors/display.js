"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.display = void 0;
var parser_1 = require("../syntax/parser");
exports.display = {
    name: 'display',
    initialValue: 'inline-block',
    prefix: false,
    type: 1 /* LIST */,
    parse: function (_context, tokens) {
        return tokens.filter(parser_1.isIdentToken).reduce(function (bit, token) {
            return bit | parseDisplayValue(token.value);
        }, 0 /* NONE */);
    }
};
var parseDisplayValue = function (display) {
    switch (display) {
        case 'block':
        case '-webkit-box':
            return 2 /* BLOCK */;
        case 'inline':
            return 4 /* INLINE */;
        case 'run-in':
            return 8 /* RUN_IN */;
        case 'flow':
            return 16 /* FLOW */;
        case 'flow-root':
            return 32 /* FLOW_ROOT */;
        case 'table':
            return 64 /* TABLE */;
        case 'flex':
        case '-webkit-flex':
            return 128 /* FLEX */;
        case 'grid':
        case '-ms-grid':
            return 256 /* GRID */;
        case 'ruby':
            return 512 /* RUBY */;
        case 'subgrid':
            return 1024 /* SUBGRID */;
        case 'list-item':
            return 2048 /* LIST_ITEM */;
        case 'table-row-group':
            return 4096 /* TABLE_ROW_GROUP */;
        case 'table-header-group':
            return 8192 /* TABLE_HEADER_GROUP */;
        case 'table-footer-group':
            return 16384 /* TABLE_FOOTER_GROUP */;
        case 'table-row':
            return 32768 /* TABLE_ROW */;
        case 'table-cell':
            return 65536 /* TABLE_CELL */;
        case 'table-column-group':
            return 131072 /* TABLE_COLUMN_GROUP */;
        case 'table-column':
            return 262144 /* TABLE_COLUMN */;
        case 'table-caption':
            return 524288 /* TABLE_CAPTION */;
        case 'ruby-base':
            return 1048576 /* RUBY_BASE */;
        case 'ruby-text':
            return 2097152 /* RUBY_TEXT */;
        case 'ruby-base-container':
            return 4194304 /* RUBY_BASE_CONTAINER */;
        case 'ruby-text-container':
            return 8388608 /* RUBY_TEXT_CONTAINER */;
        case 'contents':
            return 16777216 /* CONTENTS */;
        case 'inline-block':
            return 33554432 /* INLINE_BLOCK */;
        case 'inline-list-item':
            return 67108864 /* INLINE_LIST_ITEM */;
        case 'inline-table':
            return 134217728 /* INLINE_TABLE */;
        case 'inline-flex':
            return 268435456 /* INLINE_FLEX */;
        case 'inline-grid':
            return 536870912 /* INLINE_GRID */;
    }
    return 0 /* NONE */;
};
//# sourceMappingURL=display.js.map