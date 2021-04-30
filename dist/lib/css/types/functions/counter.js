"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var list_style_type_1 = require("../../property-descriptors/list-style-type");
var css_line_break_1 = require("css-line-break");
var bitwise_1 = require("../../../core/bitwise");
var CounterState = /** @class */ (function () {
    function CounterState() {
        this.counters = {};
    }
    CounterState.prototype.getCounterValue = function (name) {
        var counter = this.counters[name];
        if (counter && counter.length) {
            return counter[counter.length - 1];
        }
        return 1;
    };
    CounterState.prototype.getCounterValues = function (name) {
        var counter = this.counters[name];
        return counter ? counter : [];
    };
    CounterState.prototype.pop = function (counters) {
        var _this = this;
        counters.forEach(function (counter) { return _this.counters[counter].pop(); });
    };
    CounterState.prototype.parse = function (style) {
        var _this = this;
        var counterIncrement = style.counterIncrement;
        var counterReset = style.counterReset;
        var canReset = true;
        if (counterIncrement !== null) {
            counterIncrement.forEach(function (entry) {
                var counter = _this.counters[entry.counter];
                if (counter && entry.increment !== 0) {
                    canReset = false;
                    counter[Math.max(0, counter.length - 1)] += entry.increment;
                }
            });
        }
        var counterNames = [];
        if (canReset) {
            counterReset.forEach(function (entry) {
                var counter = _this.counters[entry.counter];
                counterNames.push(entry.counter);
                if (!counter) {
                    counter = _this.counters[entry.counter] = [];
                }
                counter.push(entry.reset);
            });
        }
        return counterNames;
    };
    return CounterState;
}());
exports.CounterState = CounterState;
var ROMAN_UPPER = {
    integers: [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1],
    values: ['M', 'CM', 'D', 'CD', 'C', 'XC', 'L', 'XL', 'X', 'IX', 'V', 'IV', 'I']
};
var ARMENIAN = {
    integers: [
        9000,
        8000,
        7000,
        6000,
        5000,
        4000,
        3000,
        2000,
        1000,
        900,
        800,
        700,
        600,
        500,
        400,
        300,
        200,
        100,
        90,
        80,
        70,
        60,
        50,
        40,
        30,
        20,
        10,
        9,
        8,
        7,
        6,
        5,
        4,
        3,
        2,
        1
    ],
    values: [
        'Ք',
        'Փ',
        'Ւ',
        'Ց',
        'Ր',
        'Տ',
        'Վ',
        'Ս',
        'Ռ',
        'Ջ',
        'Պ',
        'Չ',
        'Ո',
        'Շ',
        'Ն',
        'Յ',
        'Մ',
        'Ճ',
        'Ղ',
        'Ձ',
        'Հ',
        'Կ',
        'Ծ',
        'Խ',
        'Լ',
        'Ի',
        'Ժ',
        'Թ',
        'Ը',
        'Է',
        'Զ',
        'Ե',
        'Դ',
        'Գ',
        'Բ',
        'Ա'
    ]
};
var HEBREW = {
    integers: [
        10000,
        9000,
        8000,
        7000,
        6000,
        5000,
        4000,
        3000,
        2000,
        1000,
        400,
        300,
        200,
        100,
        90,
        80,
        70,
        60,
        50,
        40,
        30,
        20,
        19,
        18,
        17,
        16,
        15,
        10,
        9,
        8,
        7,
        6,
        5,
        4,
        3,
        2,
        1
    ],
    values: [
        'י׳',
        'ט׳',
        'ח׳',
        'ז׳',
        'ו׳',
        'ה׳',
        'ד׳',
        'ג׳',
        'ב׳',
        'א׳',
        'ת',
        'ש',
        'ר',
        'ק',
        'צ',
        'פ',
        'ע',
        'ס',
        'נ',
        'מ',
        'ל',
        'כ',
        'יט',
        'יח',
        'יז',
        'טז',
        'טו',
        'י',
        'ט',
        'ח',
        'ז',
        'ו',
        'ה',
        'ד',
        'ג',
        'ב',
        'א'
    ]
};
var GEORGIAN = {
    integers: [
        10000,
        9000,
        8000,
        7000,
        6000,
        5000,
        4000,
        3000,
        2000,
        1000,
        900,
        800,
        700,
        600,
        500,
        400,
        300,
        200,
        100,
        90,
        80,
        70,
        60,
        50,
        40,
        30,
        20,
        10,
        9,
        8,
        7,
        6,
        5,
        4,
        3,
        2,
        1
    ],
    values: [
        'ჵ',
        'ჰ',
        'ჯ',
        'ჴ',
        'ხ',
        'ჭ',
        'წ',
        'ძ',
        'ც',
        'ჩ',
        'შ',
        'ყ',
        'ღ',
        'ქ',
        'ფ',
        'ჳ',
        'ტ',
        'ს',
        'რ',
        'ჟ',
        'პ',
        'ო',
        'ჲ',
        'ნ',
        'მ',
        'ლ',
        'კ',
        'ი',
        'თ',
        'ჱ',
        'ზ',
        'ვ',
        'ე',
        'დ',
        'გ',
        'ბ',
        'ა'
    ]
};
var createAdditiveCounter = function (value, min, max, symbols, fallback, suffix) {
    if (value < min || value > max) {
        return exports.createCounterText(value, fallback, suffix.length > 0);
    }
    return (symbols.integers.reduce(function (string, integer, index) {
        while (value >= integer) {
            value -= integer;
            string += symbols.values[index];
        }
        return string;
    }, '') + suffix);
};
var createCounterStyleWithSymbolResolver = function (value, codePointRangeLength, isNumeric, resolver) {
    var string = '';
    do {
        if (!isNumeric) {
            value--;
        }
        string = resolver(value) + string;
        value /= codePointRangeLength;
    } while (value * codePointRangeLength >= codePointRangeLength);
    return string;
};
var createCounterStyleFromRange = function (value, codePointRangeStart, codePointRangeEnd, isNumeric, suffix) {
    var codePointRangeLength = codePointRangeEnd - codePointRangeStart + 1;
    return ((value < 0 ? '-' : '') +
        (createCounterStyleWithSymbolResolver(Math.abs(value), codePointRangeLength, isNumeric, function (codePoint) {
            return css_line_break_1.fromCodePoint(Math.floor(codePoint % codePointRangeLength) + codePointRangeStart);
        }) +
            suffix));
};
var createCounterStyleFromSymbols = function (value, symbols, suffix) {
    if (suffix === void 0) { suffix = '. '; }
    var codePointRangeLength = symbols.length;
    return (createCounterStyleWithSymbolResolver(Math.abs(value), codePointRangeLength, false, function (codePoint) { return symbols[Math.floor(codePoint % codePointRangeLength)]; }) + suffix);
};
var CJK_ZEROS = 1 << 0;
var CJK_TEN_COEFFICIENTS = 1 << 1;
var CJK_TEN_HIGH_COEFFICIENTS = 1 << 2;
var CJK_HUNDRED_COEFFICIENTS = 1 << 3;
var createCJKCounter = function (value, numbers, multipliers, negativeSign, suffix, flags) {
    if (value < -9999 || value > 9999) {
        return exports.createCounterText(value, list_style_type_1.LIST_STYLE_TYPE.CJK_DECIMAL, suffix.length > 0);
    }
    var tmp = Math.abs(value);
    var string = suffix;
    if (tmp === 0) {
        return numbers[0] + string;
    }
    for (var digit = 0; tmp > 0 && digit <= 4; digit++) {
        var coefficient = tmp % 10;
        if (coefficient === 0 && bitwise_1.contains(flags, CJK_ZEROS) && string !== '') {
            string = numbers[coefficient] + string;
        }
        else if (coefficient > 1 ||
            (coefficient === 1 && digit === 0) ||
            (coefficient === 1 && digit === 1 && bitwise_1.contains(flags, CJK_TEN_COEFFICIENTS)) ||
            (coefficient === 1 && digit === 1 && bitwise_1.contains(flags, CJK_TEN_HIGH_COEFFICIENTS) && value > 100) ||
            (coefficient === 1 && digit > 1 && bitwise_1.contains(flags, CJK_HUNDRED_COEFFICIENTS))) {
            string = numbers[coefficient] + (digit > 0 ? multipliers[digit - 1] : '') + string;
        }
        else if (coefficient === 1 && digit > 0) {
            string = multipliers[digit - 1] + string;
        }
        tmp = Math.floor(tmp / 10);
    }
    return (value < 0 ? negativeSign : '') + string;
};
var CHINESE_INFORMAL_MULTIPLIERS = '十百千萬';
var CHINESE_FORMAL_MULTIPLIERS = '拾佰仟萬';
var JAPANESE_NEGATIVE = 'マイナス';
var KOREAN_NEGATIVE = '마이너스';
exports.createCounterText = function (value, type, appendSuffix) {
    var defaultSuffix = appendSuffix ? '. ' : '';
    var cjkSuffix = appendSuffix ? '、' : '';
    var koreanSuffix = appendSuffix ? ', ' : '';
    var spaceSuffix = appendSuffix ? ' ' : '';
    switch (type) {
        case list_style_type_1.LIST_STYLE_TYPE.DISC:
            return '•' + spaceSuffix;
        case list_style_type_1.LIST_STYLE_TYPE.CIRCLE:
            return '◦' + spaceSuffix;
        case list_style_type_1.LIST_STYLE_TYPE.SQUARE:
            return '◾' + spaceSuffix;
        case list_style_type_1.LIST_STYLE_TYPE.DECIMAL_LEADING_ZERO:
            var string = createCounterStyleFromRange(value, 48, 57, true, defaultSuffix);
            return string.length < 4 ? "0" + string : string;
        case list_style_type_1.LIST_STYLE_TYPE.CJK_DECIMAL:
            return createCounterStyleFromSymbols(value, '〇一二三四五六七八九', cjkSuffix);
        case list_style_type_1.LIST_STYLE_TYPE.LOWER_ROMAN:
            return createAdditiveCounter(value, 1, 3999, ROMAN_UPPER, list_style_type_1.LIST_STYLE_TYPE.DECIMAL, defaultSuffix).toLowerCase();
        case list_style_type_1.LIST_STYLE_TYPE.UPPER_ROMAN:
            return createAdditiveCounter(value, 1, 3999, ROMAN_UPPER, list_style_type_1.LIST_STYLE_TYPE.DECIMAL, defaultSuffix);
        case list_style_type_1.LIST_STYLE_TYPE.LOWER_GREEK:
            return createCounterStyleFromRange(value, 945, 969, false, defaultSuffix);
        case list_style_type_1.LIST_STYLE_TYPE.LOWER_ALPHA:
            return createCounterStyleFromRange(value, 97, 122, false, defaultSuffix);
        case list_style_type_1.LIST_STYLE_TYPE.UPPER_ALPHA:
            return createCounterStyleFromRange(value, 65, 90, false, defaultSuffix);
        case list_style_type_1.LIST_STYLE_TYPE.ARABIC_INDIC:
            return createCounterStyleFromRange(value, 1632, 1641, true, defaultSuffix);
        case list_style_type_1.LIST_STYLE_TYPE.ARMENIAN:
        case list_style_type_1.LIST_STYLE_TYPE.UPPER_ARMENIAN:
            return createAdditiveCounter(value, 1, 9999, ARMENIAN, list_style_type_1.LIST_STYLE_TYPE.DECIMAL, defaultSuffix);
        case list_style_type_1.LIST_STYLE_TYPE.LOWER_ARMENIAN:
            return createAdditiveCounter(value, 1, 9999, ARMENIAN, list_style_type_1.LIST_STYLE_TYPE.DECIMAL, defaultSuffix).toLowerCase();
        case list_style_type_1.LIST_STYLE_TYPE.BENGALI:
            return createCounterStyleFromRange(value, 2534, 2543, true, defaultSuffix);
        case list_style_type_1.LIST_STYLE_TYPE.CAMBODIAN:
        case list_style_type_1.LIST_STYLE_TYPE.KHMER:
            return createCounterStyleFromRange(value, 6112, 6121, true, defaultSuffix);
        case list_style_type_1.LIST_STYLE_TYPE.CJK_EARTHLY_BRANCH:
            return createCounterStyleFromSymbols(value, '子丑寅卯辰巳午未申酉戌亥', cjkSuffix);
        case list_style_type_1.LIST_STYLE_TYPE.CJK_HEAVENLY_STEM:
            return createCounterStyleFromSymbols(value, '甲乙丙丁戊己庚辛壬癸', cjkSuffix);
        case list_style_type_1.LIST_STYLE_TYPE.CJK_IDEOGRAPHIC:
        case list_style_type_1.LIST_STYLE_TYPE.TRAD_CHINESE_INFORMAL:
            return createCJKCounter(value, '零一二三四五六七八九', CHINESE_INFORMAL_MULTIPLIERS, '負', cjkSuffix, CJK_TEN_COEFFICIENTS | CJK_TEN_HIGH_COEFFICIENTS | CJK_HUNDRED_COEFFICIENTS);
        case list_style_type_1.LIST_STYLE_TYPE.TRAD_CHINESE_FORMAL:
            return createCJKCounter(value, '零壹貳參肆伍陸柒捌玖', CHINESE_FORMAL_MULTIPLIERS, '負', cjkSuffix, CJK_ZEROS | CJK_TEN_COEFFICIENTS | CJK_TEN_HIGH_COEFFICIENTS | CJK_HUNDRED_COEFFICIENTS);
        case list_style_type_1.LIST_STYLE_TYPE.SIMP_CHINESE_INFORMAL:
            return createCJKCounter(value, '零一二三四五六七八九', CHINESE_INFORMAL_MULTIPLIERS, '负', cjkSuffix, CJK_TEN_COEFFICIENTS | CJK_TEN_HIGH_COEFFICIENTS | CJK_HUNDRED_COEFFICIENTS);
        case list_style_type_1.LIST_STYLE_TYPE.SIMP_CHINESE_FORMAL:
            return createCJKCounter(value, '零壹贰叁肆伍陆柒捌玖', CHINESE_FORMAL_MULTIPLIERS, '负', cjkSuffix, CJK_ZEROS | CJK_TEN_COEFFICIENTS | CJK_TEN_HIGH_COEFFICIENTS | CJK_HUNDRED_COEFFICIENTS);
        case list_style_type_1.LIST_STYLE_TYPE.JAPANESE_INFORMAL:
            return createCJKCounter(value, '〇一二三四五六七八九', '十百千万', JAPANESE_NEGATIVE, cjkSuffix, 0);
        case list_style_type_1.LIST_STYLE_TYPE.JAPANESE_FORMAL:
            return createCJKCounter(value, '零壱弐参四伍六七八九', '拾百千万', JAPANESE_NEGATIVE, cjkSuffix, CJK_ZEROS | CJK_TEN_COEFFICIENTS | CJK_TEN_HIGH_COEFFICIENTS);
        case list_style_type_1.LIST_STYLE_TYPE.KOREAN_HANGUL_FORMAL:
            return createCJKCounter(value, '영일이삼사오육칠팔구', '십백천만', KOREAN_NEGATIVE, koreanSuffix, CJK_ZEROS | CJK_TEN_COEFFICIENTS | CJK_TEN_HIGH_COEFFICIENTS);
        case list_style_type_1.LIST_STYLE_TYPE.KOREAN_HANJA_INFORMAL:
            return createCJKCounter(value, '零一二三四五六七八九', '十百千萬', KOREAN_NEGATIVE, koreanSuffix, 0);
        case list_style_type_1.LIST_STYLE_TYPE.KOREAN_HANJA_FORMAL:
            return createCJKCounter(value, '零壹貳參四五六七八九', '拾百千', KOREAN_NEGATIVE, koreanSuffix, CJK_ZEROS | CJK_TEN_COEFFICIENTS | CJK_TEN_HIGH_COEFFICIENTS);
        case list_style_type_1.LIST_STYLE_TYPE.DEVANAGARI:
            return createCounterStyleFromRange(value, 0x966, 0x96f, true, defaultSuffix);
        case list_style_type_1.LIST_STYLE_TYPE.GEORGIAN:
            return createAdditiveCounter(value, 1, 19999, GEORGIAN, list_style_type_1.LIST_STYLE_TYPE.DECIMAL, defaultSuffix);
        case list_style_type_1.LIST_STYLE_TYPE.GUJARATI:
            return createCounterStyleFromRange(value, 0xae6, 0xaef, true, defaultSuffix);
        case list_style_type_1.LIST_STYLE_TYPE.GURMUKHI:
            return createCounterStyleFromRange(value, 0xa66, 0xa6f, true, defaultSuffix);
        case list_style_type_1.LIST_STYLE_TYPE.HEBREW:
            return createAdditiveCounter(value, 1, 10999, HEBREW, list_style_type_1.LIST_STYLE_TYPE.DECIMAL, defaultSuffix);
        case list_style_type_1.LIST_STYLE_TYPE.HIRAGANA:
            return createCounterStyleFromSymbols(value, 'あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわゐゑをん');
        case list_style_type_1.LIST_STYLE_TYPE.HIRAGANA_IROHA:
            return createCounterStyleFromSymbols(value, 'いろはにほへとちりぬるをわかよたれそつねならむうゐのおくやまけふこえてあさきゆめみしゑひもせす');
        case list_style_type_1.LIST_STYLE_TYPE.KANNADA:
            return createCounterStyleFromRange(value, 0xce6, 0xcef, true, defaultSuffix);
        case list_style_type_1.LIST_STYLE_TYPE.KATAKANA:
            return createCounterStyleFromSymbols(value, 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヰヱヲン', cjkSuffix);
        case list_style_type_1.LIST_STYLE_TYPE.KATAKANA_IROHA:
            return createCounterStyleFromSymbols(value, 'イロハニホヘトチリヌルヲワカヨタレソツネナラムウヰノオクヤマケフコエテアサキユメミシヱヒモセス', cjkSuffix);
        case list_style_type_1.LIST_STYLE_TYPE.LAO:
            return createCounterStyleFromRange(value, 0xed0, 0xed9, true, defaultSuffix);
        case list_style_type_1.LIST_STYLE_TYPE.MONGOLIAN:
            return createCounterStyleFromRange(value, 0x1810, 0x1819, true, defaultSuffix);
        case list_style_type_1.LIST_STYLE_TYPE.MYANMAR:
            return createCounterStyleFromRange(value, 0x1040, 0x1049, true, defaultSuffix);
        case list_style_type_1.LIST_STYLE_TYPE.ORIYA:
            return createCounterStyleFromRange(value, 0xb66, 0xb6f, true, defaultSuffix);
        case list_style_type_1.LIST_STYLE_TYPE.PERSIAN:
            return createCounterStyleFromRange(value, 0x6f0, 0x6f9, true, defaultSuffix);
        case list_style_type_1.LIST_STYLE_TYPE.TAMIL:
            return createCounterStyleFromRange(value, 0xbe6, 0xbef, true, defaultSuffix);
        case list_style_type_1.LIST_STYLE_TYPE.TELUGU:
            return createCounterStyleFromRange(value, 0xc66, 0xc6f, true, defaultSuffix);
        case list_style_type_1.LIST_STYLE_TYPE.THAI:
            return createCounterStyleFromRange(value, 0xe50, 0xe59, true, defaultSuffix);
        case list_style_type_1.LIST_STYLE_TYPE.TIBETAN:
            return createCounterStyleFromRange(value, 0xf20, 0xf29, true, defaultSuffix);
        case list_style_type_1.LIST_STYLE_TYPE.DECIMAL:
        default:
            return createCounterStyleFromRange(value, 48, 57, true, defaultSuffix);
    }
};
//# sourceMappingURL=counter.js.map