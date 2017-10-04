'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var parseLetterSpacing = exports.parseLetterSpacing = function parseLetterSpacing(letterSpacing) {
    if (letterSpacing === 'normal') {
        return 0;
    }
    var value = parseInt(letterSpacing, 10);
    return isNaN(value) ? 0 : value;
};