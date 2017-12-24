/* @flow */
'use strict';

import type ResourceLoader from './ResourceLoader';
import type {ListStyleType} from './parsing/listStyle';

import {copyCSSStyles, contains} from './Util';
import NodeContainer from './NodeContainer';
import TextContainer from './TextContainer';
import {LIST_STYLE_POSITION, LIST_STYLE_TYPE} from './parsing/listStyle';
import {fromCodePoint} from './Unicode';

// Margin between the enumeration and the list item content
const MARGIN_RIGHT = 7;

const ancestorTypes = ['OL', 'UL', 'MENU'];

export const getListOwner = (container: NodeContainer): ?NodeContainer => {
    let parent = container.parent;
    if (!parent) {
        return null;
    }

    do {
        let isAncestor = ancestorTypes.indexOf(parent.tagName) !== -1;
        if (isAncestor) {
            return parent;
        }
        parent = parent.parent;
    } while (parent);

    return container.parent;
};

export const inlineListItemElement = (
    node: HTMLElement,
    container: NodeContainer,
    resourceLoader: ResourceLoader
): void => {
    const listStyle = container.style.listStyle;

    if (!listStyle) {
        return;
    }

    const style = node.ownerDocument.defaultView.getComputedStyle(node, null);
    const wrapper = node.ownerDocument.createElement('html2canvaswrapper');
    copyCSSStyles(style, wrapper);

    wrapper.style.position = 'absolute';
    wrapper.style.bottom = 'auto';
    wrapper.style.display = 'block';
    wrapper.style.letterSpacing = 'normal';

    switch (listStyle.listStylePosition) {
        case LIST_STYLE_POSITION.OUTSIDE:
            wrapper.style.left = 'auto';
            wrapper.style.right = `${node.ownerDocument.defaultView.innerWidth -
                container.bounds.left -
                container.style.margin[1].getAbsoluteValue(container.bounds.width) +
                MARGIN_RIGHT}px`;
            wrapper.style.textAlign = 'right';
            break;
        case LIST_STYLE_POSITION.INSIDE:
            wrapper.style.left = `${container.bounds.left -
                container.style.margin[3].getAbsoluteValue(container.bounds.width)}px`;
            wrapper.style.right = 'auto';
            wrapper.style.textAlign = 'left';
            break;
    }

    let text;
    const MARGIN_TOP = container.style.margin[0].getAbsoluteValue(container.bounds.width);
    const styleImage = listStyle.listStyleImage;
    if (styleImage) {
        if (styleImage.method === 'url') {
            const image = node.ownerDocument.createElement('img');
            image.src = styleImage.args[0];
            wrapper.style.top = `${container.bounds.top - MARGIN_TOP}px`;
            wrapper.style.width = 'auto';
            wrapper.style.height = 'auto';
            wrapper.appendChild(image);
        } else {
            const size = parseFloat(container.style.font.fontSize) * 0.5;
            wrapper.style.top = `${container.bounds.top -
                MARGIN_TOP +
                container.bounds.height -
                1.5 * size}px`;
            wrapper.style.width = `${size}px`;
            wrapper.style.height = `${size}px`;
            wrapper.style.backgroundImage = style.listStyleImage;
        }
    } else if (typeof container.listIndex === 'number') {
        text = node.ownerDocument.createTextNode(
            createCounterText(container.listIndex, listStyle.listStyleType, true)
        );
        wrapper.appendChild(text);
        wrapper.style.top = `${container.bounds.top - MARGIN_TOP}px`;
    }

    // $FlowFixMe
    const body: HTMLBodyElement = node.ownerDocument.body;
    body.appendChild(wrapper);

    if (text) {
        container.childNodes.push(TextContainer.fromTextNode(text, container));
        body.removeChild(wrapper);
    } else {
        // $FlowFixMe
        container.childNodes.push(new NodeContainer(wrapper, container, resourceLoader, 0));
    }
};

const ROMAN_UPPER = {
    integers: [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1],
    values: ['M', 'CM', 'D', 'CD', 'C', 'XC', 'L', 'XL', 'X', 'IX', 'V', 'IV', 'I']
};

const ARMENIAN = {
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

const HEBREW = {
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

const GEORGIAN = {
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

const createAdditiveCounter = (
    value: number,
    min: number,
    max: number,
    symbols,
    fallback: ListStyleType,
    suffix: string
) => {
    if (value < min || value > max) {
        return createCounterText(value, fallback, suffix.length > 0);
    }

    return (
        symbols.integers.reduce((string, integer, index) => {
            while (value >= integer) {
                value -= integer;
                string += symbols.values[index];
            }
            return string;
        }, '') + suffix
    );
};

const createCounterStyleWithSymbolResolver = (
    value: number,
    codePointRangeLength: number,
    isNumeric: boolean,
    resolver
): string => {
    let string = '';

    do {
        if (!isNumeric) {
            value--;
        }
        string = resolver(value) + string;
        value /= codePointRangeLength;
    } while (value * codePointRangeLength >= codePointRangeLength);

    return string;
};

const createCounterStyleFromRange = (
    value: number,
    codePointRangeStart: number,
    codePointRangeEnd: number,
    isNumeric: boolean,
    suffix: string
): string => {
    const codePointRangeLength = codePointRangeEnd - codePointRangeStart + 1;

    return (
        (value < 0 ? '-' : '') +
        (createCounterStyleWithSymbolResolver(
            Math.abs(value),
            codePointRangeLength,
            isNumeric,
            codePoint =>
                fromCodePoint(Math.floor(codePoint % codePointRangeLength) + codePointRangeStart)
        ) +
            suffix)
    );
};

const createCounterStyleFromSymbols = (
    value: number,
    symbols: string,
    suffix: string = '. '
): string => {
    const codePointRangeLength = symbols.length;
    return (
        createCounterStyleWithSymbolResolver(
            Math.abs(value),
            codePointRangeLength,
            false,
            codePoint => symbols[Math.floor(codePoint % codePointRangeLength)]
        ) + suffix
    );
};

const CJK_ZEROS = 1 << 0;
const CJK_TEN_COEFFICIENTS = 1 << 1;
const CJK_TEN_HIGH_COEFFICIENTS = 1 << 2;
const CJK_HUNDRED_COEFFICIENTS = 1 << 3;

const createCJKCounter = (
    value: number,
    numbers: string,
    multipliers: string,
    negativeSign: string,
    suffix: string,
    flags: number
): string => {
    if (value < -9999 || value > 9999) {
        return createCounterText(value, LIST_STYLE_TYPE.CJK_DECIMAL, suffix.length > 0);
    }
    let tmp = Math.abs(value);
    let string = suffix;

    if (tmp === 0) {
        return numbers[0] + string;
    }

    for (let digit = 0; tmp > 0 && digit <= 4; digit++) {
        let coefficient = tmp % 10;

        if (coefficient === 0 && contains(flags, CJK_ZEROS) && string !== '') {
            string = numbers[coefficient] + string;
        } else if (
            coefficient > 1 ||
            (coefficient === 1 && digit === 0) ||
            (coefficient === 1 && digit === 1 && contains(flags, CJK_TEN_COEFFICIENTS)) ||
            (coefficient === 1 &&
                digit === 1 &&
                contains(flags, CJK_TEN_HIGH_COEFFICIENTS) &&
                value > 100) ||
            (coefficient === 1 && digit > 1 && contains(flags, CJK_HUNDRED_COEFFICIENTS))
        ) {
            string = numbers[coefficient] + (digit > 0 ? multipliers[digit - 1] : '') + string;
        } else if (coefficient === 1 && digit > 0) {
            string = multipliers[digit - 1] + string;
        }
        tmp = Math.floor(tmp / 10);
    }

    return (value < 0 ? negativeSign : '') + string;
};

const CHINESE_INFORMAL_MULTIPLIERS = '十百千萬';
const CHINESE_FORMAL_MULTIPLIERS = '拾佰仟萬';
const JAPANESE_NEGATIVE = 'マイナス';
const KOREAN_NEGATIVE = '마이너스 ';

export const createCounterText = (
    value: number,
    type: ListStyleType,
    appendSuffix: boolean
): string => {
    const defaultSuffix = appendSuffix ? '. ' : '';
    const cjkSuffix = appendSuffix ? '、' : '';
    const koreanSuffix = appendSuffix ? ', ' : '';
    switch (type) {
        case LIST_STYLE_TYPE.DISC:
            return '•';
        case LIST_STYLE_TYPE.CIRCLE:
            return '◦';
        case LIST_STYLE_TYPE.SQUARE:
            return '◾';
        case LIST_STYLE_TYPE.DECIMAL_LEADING_ZERO:
            const string = createCounterStyleFromRange(value, 48, 57, true, defaultSuffix);
            return string.length < 4 ? `0${string}` : string;
        case LIST_STYLE_TYPE.CJK_DECIMAL:
            return createCounterStyleFromSymbols(value, '〇一二三四五六七八九', cjkSuffix);
        case LIST_STYLE_TYPE.LOWER_ROMAN:
            return createAdditiveCounter(
                value,
                1,
                3999,
                ROMAN_UPPER,
                LIST_STYLE_TYPE.DECIMAL,
                defaultSuffix
            ).toLowerCase();
        case LIST_STYLE_TYPE.UPPER_ROMAN:
            return createAdditiveCounter(
                value,
                1,
                3999,
                ROMAN_UPPER,
                LIST_STYLE_TYPE.DECIMAL,
                defaultSuffix
            );
        case LIST_STYLE_TYPE.LOWER_GREEK:
            return createCounterStyleFromRange(value, 945, 969, false, defaultSuffix);
        case LIST_STYLE_TYPE.LOWER_ALPHA:
            return createCounterStyleFromRange(value, 97, 122, false, defaultSuffix);
        case LIST_STYLE_TYPE.UPPER_ALPHA:
            return createCounterStyleFromRange(value, 65, 90, false, defaultSuffix);
        case LIST_STYLE_TYPE.ARABIC_INDIC:
            return createCounterStyleFromRange(value, 1632, 1641, true, defaultSuffix);
        case LIST_STYLE_TYPE.ARMENIAN:
        case LIST_STYLE_TYPE.UPPER_ARMENIAN:
            return createAdditiveCounter(
                value,
                1,
                9999,
                ARMENIAN,
                LIST_STYLE_TYPE.DECIMAL,
                defaultSuffix
            );
        case LIST_STYLE_TYPE.LOWER_ARMENIAN:
            return createAdditiveCounter(
                value,
                1,
                9999,
                ARMENIAN,
                LIST_STYLE_TYPE.DECIMAL,
                defaultSuffix
            ).toLowerCase();
        case LIST_STYLE_TYPE.BENGALI:
            return createCounterStyleFromRange(value, 2534, 2543, true, defaultSuffix);
        case LIST_STYLE_TYPE.CAMBODIAN:
        case LIST_STYLE_TYPE.KHMER:
            return createCounterStyleFromRange(value, 6112, 6121, true, defaultSuffix);
        case LIST_STYLE_TYPE.CJK_EARTHLY_BRANCH:
            return createCounterStyleFromSymbols(value, '子丑寅卯辰巳午未申酉戌亥', cjkSuffix);
        case LIST_STYLE_TYPE.CJK_HEAVENLY_STEM:
            return createCounterStyleFromSymbols(value, '甲乙丙丁戊己庚辛壬癸', cjkSuffix);
        case LIST_STYLE_TYPE.CJK_IDEOGRAPHIC:
        case LIST_STYLE_TYPE.TRAD_CHINESE_INFORMAL:
            return createCJKCounter(
                value,
                '零一二三四五六七八九',
                CHINESE_INFORMAL_MULTIPLIERS,
                '負',
                cjkSuffix,
                CJK_TEN_COEFFICIENTS | CJK_TEN_HIGH_COEFFICIENTS | CJK_HUNDRED_COEFFICIENTS
            );
        case LIST_STYLE_TYPE.TRAD_CHINESE_FORMAL:
            return createCJKCounter(
                value,
                '零壹貳參肆伍陸柒捌玖',
                CHINESE_FORMAL_MULTIPLIERS,
                '負',
                cjkSuffix,
                CJK_ZEROS |
                    CJK_TEN_COEFFICIENTS |
                    CJK_TEN_HIGH_COEFFICIENTS |
                    CJK_HUNDRED_COEFFICIENTS
            );
        case LIST_STYLE_TYPE.SIMP_CHINESE_INFORMAL:
            return createCJKCounter(
                value,
                '零一二三四五六七八九',
                CHINESE_INFORMAL_MULTIPLIERS,
                '负',
                cjkSuffix,
                CJK_TEN_COEFFICIENTS | CJK_TEN_HIGH_COEFFICIENTS | CJK_HUNDRED_COEFFICIENTS
            );
        case LIST_STYLE_TYPE.SIMP_CHINESE_FORMAL:
            return createCJKCounter(
                value,
                '零壹贰叁肆伍陆柒捌玖',
                CHINESE_FORMAL_MULTIPLIERS,
                '负',
                cjkSuffix,
                CJK_ZEROS |
                    CJK_TEN_COEFFICIENTS |
                    CJK_TEN_HIGH_COEFFICIENTS |
                    CJK_HUNDRED_COEFFICIENTS
            );
        case LIST_STYLE_TYPE.JAPANESE_INFORMAL:
            return createCJKCounter(value, '〇一二三四五六七八九', '十百千万', JAPANESE_NEGATIVE, cjkSuffix, 0);
        case LIST_STYLE_TYPE.JAPANESE_FORMAL:
            return createCJKCounter(
                value,
                '零壱弐参四伍六七八九',
                '拾百千万',
                JAPANESE_NEGATIVE,
                cjkSuffix,
                CJK_ZEROS | CJK_TEN_COEFFICIENTS | CJK_TEN_HIGH_COEFFICIENTS
            );
        case LIST_STYLE_TYPE.KOREAN_HANGUL_FORMAL:
            return createCJKCounter(
                value,
                '영일이삼사오육칠팔구',
                '십백천만',
                KOREAN_NEGATIVE,
                koreanSuffix,
                CJK_ZEROS | CJK_TEN_COEFFICIENTS | CJK_TEN_HIGH_COEFFICIENTS
            );
        case LIST_STYLE_TYPE.KOREAN_HANJA_INFORMAL:
            return createCJKCounter(value, '零一二三四五六七八九', '十百千萬', KOREAN_NEGATIVE, koreanSuffix, 0);
        case LIST_STYLE_TYPE.KOREAN_HANJA_FORMAL:
            return createCJKCounter(
                value,
                '零壹貳參四五六七八九',
                '拾百千',
                KOREAN_NEGATIVE,
                koreanSuffix,
                CJK_ZEROS | CJK_TEN_COEFFICIENTS | CJK_TEN_HIGH_COEFFICIENTS
            );
        case LIST_STYLE_TYPE.DEVANAGARI:
            return createCounterStyleFromRange(value, 0x966, 0x96f, true, defaultSuffix);
        case LIST_STYLE_TYPE.GEORGIAN:
            return createAdditiveCounter(
                value,
                1,
                19999,
                GEORGIAN,
                LIST_STYLE_TYPE.DECIMAL,
                defaultSuffix
            );
        case LIST_STYLE_TYPE.GUJARATI:
            return createCounterStyleFromRange(value, 0xae6, 0xaef, true, defaultSuffix);
        case LIST_STYLE_TYPE.GURMUKHI:
            return createCounterStyleFromRange(value, 0xa66, 0xa6f, true, defaultSuffix);
        case LIST_STYLE_TYPE.HEBREW:
            return createAdditiveCounter(
                value,
                1,
                10999,
                HEBREW,
                LIST_STYLE_TYPE.DECIMAL,
                defaultSuffix
            );
        case LIST_STYLE_TYPE.HIRAGANA:
            return createCounterStyleFromSymbols(
                value,
                'あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわゐゑをん'
            );
        case LIST_STYLE_TYPE.HIRAGANA_IROHA:
            return createCounterStyleFromSymbols(
                value,
                'いろはにほへとちりぬるをわかよたれそつねならむうゐのおくやまけふこえてあさきゆめみしゑひもせす'
            );
        case LIST_STYLE_TYPE.KANNADA:
            return createCounterStyleFromRange(value, 0xce6, 0xcef, true, defaultSuffix);
        case LIST_STYLE_TYPE.KATAKANA:
            return createCounterStyleFromSymbols(
                value,
                'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヰヱヲン',
                cjkSuffix
            );
        case LIST_STYLE_TYPE.KATAKANA_IROHA:
            return createCounterStyleFromSymbols(
                value,
                'イロハニホヘトチリヌルヲワカヨタレソツネナラムウヰノオクヤマケフコエテアサキユメミシヱヒモセス',
                cjkSuffix
            );
        case LIST_STYLE_TYPE.LAO:
            return createCounterStyleFromRange(value, 0xed0, 0xed9, true, defaultSuffix);
        case LIST_STYLE_TYPE.MONGOLIAN:
            return createCounterStyleFromRange(value, 0x1810, 0x1819, true, defaultSuffix);
        case LIST_STYLE_TYPE.MYANMAR:
            return createCounterStyleFromRange(value, 0x1040, 0x1049, true, defaultSuffix);
        case LIST_STYLE_TYPE.ORIYA:
            return createCounterStyleFromRange(value, 0xb66, 0xb6f, true, defaultSuffix);
        case LIST_STYLE_TYPE.PERSIAN:
            return createCounterStyleFromRange(value, 0x6f0, 0x6f9, true, defaultSuffix);
        case LIST_STYLE_TYPE.TAMIL:
            return createCounterStyleFromRange(value, 0xbe6, 0xbef, true, defaultSuffix);
        case LIST_STYLE_TYPE.TELUGU:
            return createCounterStyleFromRange(value, 0xc66, 0xc6f, true, defaultSuffix);
        case LIST_STYLE_TYPE.THAI:
            return createCounterStyleFromRange(value, 0xe50, 0xe59, true, defaultSuffix);
        case LIST_STYLE_TYPE.TIBETAN:
            return createCounterStyleFromRange(value, 0xf20, 0xf29, true, defaultSuffix);
        case LIST_STYLE_TYPE.DECIMAL:
        default:
            return createCounterStyleFromRange(value, 48, 57, true, defaultSuffix);
    }
};
