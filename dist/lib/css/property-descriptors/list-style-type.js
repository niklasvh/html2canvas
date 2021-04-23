"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var IPropertyDescriptor_1 = require("../IPropertyDescriptor");
var LIST_STYLE_TYPE;
(function (LIST_STYLE_TYPE) {
    LIST_STYLE_TYPE[LIST_STYLE_TYPE["NONE"] = -1] = "NONE";
    LIST_STYLE_TYPE[LIST_STYLE_TYPE["DISC"] = 0] = "DISC";
    LIST_STYLE_TYPE[LIST_STYLE_TYPE["CIRCLE"] = 1] = "CIRCLE";
    LIST_STYLE_TYPE[LIST_STYLE_TYPE["SQUARE"] = 2] = "SQUARE";
    LIST_STYLE_TYPE[LIST_STYLE_TYPE["DECIMAL"] = 3] = "DECIMAL";
    LIST_STYLE_TYPE[LIST_STYLE_TYPE["CJK_DECIMAL"] = 4] = "CJK_DECIMAL";
    LIST_STYLE_TYPE[LIST_STYLE_TYPE["DECIMAL_LEADING_ZERO"] = 5] = "DECIMAL_LEADING_ZERO";
    LIST_STYLE_TYPE[LIST_STYLE_TYPE["LOWER_ROMAN"] = 6] = "LOWER_ROMAN";
    LIST_STYLE_TYPE[LIST_STYLE_TYPE["UPPER_ROMAN"] = 7] = "UPPER_ROMAN";
    LIST_STYLE_TYPE[LIST_STYLE_TYPE["LOWER_GREEK"] = 8] = "LOWER_GREEK";
    LIST_STYLE_TYPE[LIST_STYLE_TYPE["LOWER_ALPHA"] = 9] = "LOWER_ALPHA";
    LIST_STYLE_TYPE[LIST_STYLE_TYPE["UPPER_ALPHA"] = 10] = "UPPER_ALPHA";
    LIST_STYLE_TYPE[LIST_STYLE_TYPE["ARABIC_INDIC"] = 11] = "ARABIC_INDIC";
    LIST_STYLE_TYPE[LIST_STYLE_TYPE["ARMENIAN"] = 12] = "ARMENIAN";
    LIST_STYLE_TYPE[LIST_STYLE_TYPE["BENGALI"] = 13] = "BENGALI";
    LIST_STYLE_TYPE[LIST_STYLE_TYPE["CAMBODIAN"] = 14] = "CAMBODIAN";
    LIST_STYLE_TYPE[LIST_STYLE_TYPE["CJK_EARTHLY_BRANCH"] = 15] = "CJK_EARTHLY_BRANCH";
    LIST_STYLE_TYPE[LIST_STYLE_TYPE["CJK_HEAVENLY_STEM"] = 16] = "CJK_HEAVENLY_STEM";
    LIST_STYLE_TYPE[LIST_STYLE_TYPE["CJK_IDEOGRAPHIC"] = 17] = "CJK_IDEOGRAPHIC";
    LIST_STYLE_TYPE[LIST_STYLE_TYPE["DEVANAGARI"] = 18] = "DEVANAGARI";
    LIST_STYLE_TYPE[LIST_STYLE_TYPE["ETHIOPIC_NUMERIC"] = 19] = "ETHIOPIC_NUMERIC";
    LIST_STYLE_TYPE[LIST_STYLE_TYPE["GEORGIAN"] = 20] = "GEORGIAN";
    LIST_STYLE_TYPE[LIST_STYLE_TYPE["GUJARATI"] = 21] = "GUJARATI";
    LIST_STYLE_TYPE[LIST_STYLE_TYPE["GURMUKHI"] = 22] = "GURMUKHI";
    LIST_STYLE_TYPE[LIST_STYLE_TYPE["HEBREW"] = 22] = "HEBREW";
    LIST_STYLE_TYPE[LIST_STYLE_TYPE["HIRAGANA"] = 23] = "HIRAGANA";
    LIST_STYLE_TYPE[LIST_STYLE_TYPE["HIRAGANA_IROHA"] = 24] = "HIRAGANA_IROHA";
    LIST_STYLE_TYPE[LIST_STYLE_TYPE["JAPANESE_FORMAL"] = 25] = "JAPANESE_FORMAL";
    LIST_STYLE_TYPE[LIST_STYLE_TYPE["JAPANESE_INFORMAL"] = 26] = "JAPANESE_INFORMAL";
    LIST_STYLE_TYPE[LIST_STYLE_TYPE["KANNADA"] = 27] = "KANNADA";
    LIST_STYLE_TYPE[LIST_STYLE_TYPE["KATAKANA"] = 28] = "KATAKANA";
    LIST_STYLE_TYPE[LIST_STYLE_TYPE["KATAKANA_IROHA"] = 29] = "KATAKANA_IROHA";
    LIST_STYLE_TYPE[LIST_STYLE_TYPE["KHMER"] = 30] = "KHMER";
    LIST_STYLE_TYPE[LIST_STYLE_TYPE["KOREAN_HANGUL_FORMAL"] = 31] = "KOREAN_HANGUL_FORMAL";
    LIST_STYLE_TYPE[LIST_STYLE_TYPE["KOREAN_HANJA_FORMAL"] = 32] = "KOREAN_HANJA_FORMAL";
    LIST_STYLE_TYPE[LIST_STYLE_TYPE["KOREAN_HANJA_INFORMAL"] = 33] = "KOREAN_HANJA_INFORMAL";
    LIST_STYLE_TYPE[LIST_STYLE_TYPE["LAO"] = 34] = "LAO";
    LIST_STYLE_TYPE[LIST_STYLE_TYPE["LOWER_ARMENIAN"] = 35] = "LOWER_ARMENIAN";
    LIST_STYLE_TYPE[LIST_STYLE_TYPE["MALAYALAM"] = 36] = "MALAYALAM";
    LIST_STYLE_TYPE[LIST_STYLE_TYPE["MONGOLIAN"] = 37] = "MONGOLIAN";
    LIST_STYLE_TYPE[LIST_STYLE_TYPE["MYANMAR"] = 38] = "MYANMAR";
    LIST_STYLE_TYPE[LIST_STYLE_TYPE["ORIYA"] = 39] = "ORIYA";
    LIST_STYLE_TYPE[LIST_STYLE_TYPE["PERSIAN"] = 40] = "PERSIAN";
    LIST_STYLE_TYPE[LIST_STYLE_TYPE["SIMP_CHINESE_FORMAL"] = 41] = "SIMP_CHINESE_FORMAL";
    LIST_STYLE_TYPE[LIST_STYLE_TYPE["SIMP_CHINESE_INFORMAL"] = 42] = "SIMP_CHINESE_INFORMAL";
    LIST_STYLE_TYPE[LIST_STYLE_TYPE["TAMIL"] = 43] = "TAMIL";
    LIST_STYLE_TYPE[LIST_STYLE_TYPE["TELUGU"] = 44] = "TELUGU";
    LIST_STYLE_TYPE[LIST_STYLE_TYPE["THAI"] = 45] = "THAI";
    LIST_STYLE_TYPE[LIST_STYLE_TYPE["TIBETAN"] = 46] = "TIBETAN";
    LIST_STYLE_TYPE[LIST_STYLE_TYPE["TRAD_CHINESE_FORMAL"] = 47] = "TRAD_CHINESE_FORMAL";
    LIST_STYLE_TYPE[LIST_STYLE_TYPE["TRAD_CHINESE_INFORMAL"] = 48] = "TRAD_CHINESE_INFORMAL";
    LIST_STYLE_TYPE[LIST_STYLE_TYPE["UPPER_ARMENIAN"] = 49] = "UPPER_ARMENIAN";
    LIST_STYLE_TYPE[LIST_STYLE_TYPE["DISCLOSURE_OPEN"] = 50] = "DISCLOSURE_OPEN";
    LIST_STYLE_TYPE[LIST_STYLE_TYPE["DISCLOSURE_CLOSED"] = 51] = "DISCLOSURE_CLOSED";
})(LIST_STYLE_TYPE = exports.LIST_STYLE_TYPE || (exports.LIST_STYLE_TYPE = {}));
exports.listStyleType = {
    name: 'list-style-type',
    initialValue: 'none',
    prefix: false,
    type: IPropertyDescriptor_1.PropertyDescriptorParsingType.IDENT_VALUE,
    parse: function (type) {
        switch (type) {
            case 'disc':
                return LIST_STYLE_TYPE.DISC;
            case 'circle':
                return LIST_STYLE_TYPE.CIRCLE;
            case 'square':
                return LIST_STYLE_TYPE.SQUARE;
            case 'decimal':
                return LIST_STYLE_TYPE.DECIMAL;
            case 'cjk-decimal':
                return LIST_STYLE_TYPE.CJK_DECIMAL;
            case 'decimal-leading-zero':
                return LIST_STYLE_TYPE.DECIMAL_LEADING_ZERO;
            case 'lower-roman':
                return LIST_STYLE_TYPE.LOWER_ROMAN;
            case 'upper-roman':
                return LIST_STYLE_TYPE.UPPER_ROMAN;
            case 'lower-greek':
                return LIST_STYLE_TYPE.LOWER_GREEK;
            case 'lower-alpha':
                return LIST_STYLE_TYPE.LOWER_ALPHA;
            case 'upper-alpha':
                return LIST_STYLE_TYPE.UPPER_ALPHA;
            case 'arabic-indic':
                return LIST_STYLE_TYPE.ARABIC_INDIC;
            case 'armenian':
                return LIST_STYLE_TYPE.ARMENIAN;
            case 'bengali':
                return LIST_STYLE_TYPE.BENGALI;
            case 'cambodian':
                return LIST_STYLE_TYPE.CAMBODIAN;
            case 'cjk-earthly-branch':
                return LIST_STYLE_TYPE.CJK_EARTHLY_BRANCH;
            case 'cjk-heavenly-stem':
                return LIST_STYLE_TYPE.CJK_HEAVENLY_STEM;
            case 'cjk-ideographic':
                return LIST_STYLE_TYPE.CJK_IDEOGRAPHIC;
            case 'devanagari':
                return LIST_STYLE_TYPE.DEVANAGARI;
            case 'ethiopic-numeric':
                return LIST_STYLE_TYPE.ETHIOPIC_NUMERIC;
            case 'georgian':
                return LIST_STYLE_TYPE.GEORGIAN;
            case 'gujarati':
                return LIST_STYLE_TYPE.GUJARATI;
            case 'gurmukhi':
                return LIST_STYLE_TYPE.GURMUKHI;
            case 'hebrew':
                return LIST_STYLE_TYPE.HEBREW;
            case 'hiragana':
                return LIST_STYLE_TYPE.HIRAGANA;
            case 'hiragana-iroha':
                return LIST_STYLE_TYPE.HIRAGANA_IROHA;
            case 'japanese-formal':
                return LIST_STYLE_TYPE.JAPANESE_FORMAL;
            case 'japanese-informal':
                return LIST_STYLE_TYPE.JAPANESE_INFORMAL;
            case 'kannada':
                return LIST_STYLE_TYPE.KANNADA;
            case 'katakana':
                return LIST_STYLE_TYPE.KATAKANA;
            case 'katakana-iroha':
                return LIST_STYLE_TYPE.KATAKANA_IROHA;
            case 'khmer':
                return LIST_STYLE_TYPE.KHMER;
            case 'korean-hangul-formal':
                return LIST_STYLE_TYPE.KOREAN_HANGUL_FORMAL;
            case 'korean-hanja-formal':
                return LIST_STYLE_TYPE.KOREAN_HANJA_FORMAL;
            case 'korean-hanja-informal':
                return LIST_STYLE_TYPE.KOREAN_HANJA_INFORMAL;
            case 'lao':
                return LIST_STYLE_TYPE.LAO;
            case 'lower-armenian':
                return LIST_STYLE_TYPE.LOWER_ARMENIAN;
            case 'malayalam':
                return LIST_STYLE_TYPE.MALAYALAM;
            case 'mongolian':
                return LIST_STYLE_TYPE.MONGOLIAN;
            case 'myanmar':
                return LIST_STYLE_TYPE.MYANMAR;
            case 'oriya':
                return LIST_STYLE_TYPE.ORIYA;
            case 'persian':
                return LIST_STYLE_TYPE.PERSIAN;
            case 'simp-chinese-formal':
                return LIST_STYLE_TYPE.SIMP_CHINESE_FORMAL;
            case 'simp-chinese-informal':
                return LIST_STYLE_TYPE.SIMP_CHINESE_INFORMAL;
            case 'tamil':
                return LIST_STYLE_TYPE.TAMIL;
            case 'telugu':
                return LIST_STYLE_TYPE.TELUGU;
            case 'thai':
                return LIST_STYLE_TYPE.THAI;
            case 'tibetan':
                return LIST_STYLE_TYPE.TIBETAN;
            case 'trad-chinese-formal':
                return LIST_STYLE_TYPE.TRAD_CHINESE_FORMAL;
            case 'trad-chinese-informal':
                return LIST_STYLE_TYPE.TRAD_CHINESE_INFORMAL;
            case 'upper-armenian':
                return LIST_STYLE_TYPE.UPPER_ARMENIAN;
            case 'disclosure-open':
                return LIST_STYLE_TYPE.DISCLOSURE_OPEN;
            case 'disclosure-closed':
                return LIST_STYLE_TYPE.DISCLOSURE_CLOSED;
            case 'none':
            default:
                return LIST_STYLE_TYPE.NONE;
        }
    }
};
//# sourceMappingURL=list-style-type.js.map