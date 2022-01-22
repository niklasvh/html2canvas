"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listStyleType = void 0;
exports.listStyleType = {
    name: 'list-style-type',
    initialValue: 'none',
    prefix: false,
    type: 2 /* IDENT_VALUE */,
    parse: function (_context, type) {
        switch (type) {
            case 'disc':
                return 0 /* DISC */;
            case 'circle':
                return 1 /* CIRCLE */;
            case 'square':
                return 2 /* SQUARE */;
            case 'decimal':
                return 3 /* DECIMAL */;
            case 'cjk-decimal':
                return 4 /* CJK_DECIMAL */;
            case 'decimal-leading-zero':
                return 5 /* DECIMAL_LEADING_ZERO */;
            case 'lower-roman':
                return 6 /* LOWER_ROMAN */;
            case 'upper-roman':
                return 7 /* UPPER_ROMAN */;
            case 'lower-greek':
                return 8 /* LOWER_GREEK */;
            case 'lower-alpha':
                return 9 /* LOWER_ALPHA */;
            case 'upper-alpha':
                return 10 /* UPPER_ALPHA */;
            case 'arabic-indic':
                return 11 /* ARABIC_INDIC */;
            case 'armenian':
                return 12 /* ARMENIAN */;
            case 'bengali':
                return 13 /* BENGALI */;
            case 'cambodian':
                return 14 /* CAMBODIAN */;
            case 'cjk-earthly-branch':
                return 15 /* CJK_EARTHLY_BRANCH */;
            case 'cjk-heavenly-stem':
                return 16 /* CJK_HEAVENLY_STEM */;
            case 'cjk-ideographic':
                return 17 /* CJK_IDEOGRAPHIC */;
            case 'devanagari':
                return 18 /* DEVANAGARI */;
            case 'ethiopic-numeric':
                return 19 /* ETHIOPIC_NUMERIC */;
            case 'georgian':
                return 20 /* GEORGIAN */;
            case 'gujarati':
                return 21 /* GUJARATI */;
            case 'gurmukhi':
                return 22 /* GURMUKHI */;
            case 'hebrew':
                return 22 /* HEBREW */;
            case 'hiragana':
                return 23 /* HIRAGANA */;
            case 'hiragana-iroha':
                return 24 /* HIRAGANA_IROHA */;
            case 'japanese-formal':
                return 25 /* JAPANESE_FORMAL */;
            case 'japanese-informal':
                return 26 /* JAPANESE_INFORMAL */;
            case 'kannada':
                return 27 /* KANNADA */;
            case 'katakana':
                return 28 /* KATAKANA */;
            case 'katakana-iroha':
                return 29 /* KATAKANA_IROHA */;
            case 'khmer':
                return 30 /* KHMER */;
            case 'korean-hangul-formal':
                return 31 /* KOREAN_HANGUL_FORMAL */;
            case 'korean-hanja-formal':
                return 32 /* KOREAN_HANJA_FORMAL */;
            case 'korean-hanja-informal':
                return 33 /* KOREAN_HANJA_INFORMAL */;
            case 'lao':
                return 34 /* LAO */;
            case 'lower-armenian':
                return 35 /* LOWER_ARMENIAN */;
            case 'malayalam':
                return 36 /* MALAYALAM */;
            case 'mongolian':
                return 37 /* MONGOLIAN */;
            case 'myanmar':
                return 38 /* MYANMAR */;
            case 'oriya':
                return 39 /* ORIYA */;
            case 'persian':
                return 40 /* PERSIAN */;
            case 'simp-chinese-formal':
                return 41 /* SIMP_CHINESE_FORMAL */;
            case 'simp-chinese-informal':
                return 42 /* SIMP_CHINESE_INFORMAL */;
            case 'tamil':
                return 43 /* TAMIL */;
            case 'telugu':
                return 44 /* TELUGU */;
            case 'thai':
                return 45 /* THAI */;
            case 'tibetan':
                return 46 /* TIBETAN */;
            case 'trad-chinese-formal':
                return 47 /* TRAD_CHINESE_FORMAL */;
            case 'trad-chinese-informal':
                return 48 /* TRAD_CHINESE_INFORMAL */;
            case 'upper-armenian':
                return 49 /* UPPER_ARMENIAN */;
            case 'disclosure-open':
                return 50 /* DISCLOSURE_OPEN */;
            case 'disclosure-closed':
                return 51 /* DISCLOSURE_CLOSED */;
            case 'none':
            default:
                return -1 /* NONE */;
        }
    }
};
//# sourceMappingURL=list-style-type.js.map