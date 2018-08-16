/* @flow */
'use strict';

export const FONT_VARIANT_LIGATURES = {
    NORMAL: 'normal',
    NONE: 'none',
    COMMONLIGATURES: 'common-ligatures',
    NO_COMMON_LIGATURES: 'no-common-ligatures',
    DISCRETIONARY_LIGATURES: 'discretionary-ligatures',
    NO_DISCRETIONARY_LIGATURES: 'no-discretionary-ligatures',
    HISTORICAL_LIGATURES: 'historical-ligatures',
    NO_HISTORICAL_LIGATURES: 'no-historical-ligatures',
    CONTEXTUAL: 'contextual',
    NO_CONTEXTUAL: 'no-contextual'
};

export type FontVariantLigatures = $Values<typeof FONT_VARIANT_LIGATURES>;

export const parseFontVariantLigatures = (fontVariantLigatures: string): FontVariantLigatures => {
    switch (fontVariantLigatures) {
        case 'common-ligatures':
            return FONT_VARIANT_LIGATURES.COMMONLIGATURES;
        case 'contextual':
            return FONT_VARIANT_LIGATURES.CONTEXTUAL;
        case 'discretionary-ligatures':
            return FONT_VARIANT_LIGATURES.DISCRETIONARY_LIGATURES;
        case 'historical-ligatures':
            return FONT_VARIANT_LIGATURES.HISTORICAL_LIGATURES;
        case 'none':
            return FONT_VARIANT_LIGATURES.NONE;
        case 'no-common-ligatures':
            return FONT_VARIANT_LIGATURES.NO_COMMON_LIGATURES;
        case 'no-contextual':
            return FONT_VARIANT_LIGATURES.NO_CONTEXTUAL;
        case 'no-discretionary-ligatures':
            return FONT_VARIANT_LIGATURES.NO_DISCRETIONARY_LIGATURES;
        case 'no-historical-ligatures':
            return FONT_VARIANT_LIGATURES.NO_HISTORICAL_LIGATURES;
        case 'normal':
        default:
            return FONT_VARIANT_LIGATURES.NORMAL;
    }
};
