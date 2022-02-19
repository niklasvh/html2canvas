import {IPropertyIdentValueDescriptor, PropertyDescriptorParsingType} from '../IPropertyDescriptor';
import {Context} from '../../core/context';

export const enum MIX_BLEND_MODE {
    NORMAL = 'normal',
    MULTIPLY = 'multiply',
    SCREEN = 'screen',
    OVERLAY = 'overlay',
    DARKEN = 'darken',
    LIGHTEN = 'lighten',
    COLOR_DODGE = 'color-dodge',
    COLOR_BURN = 'color-burn',
    HARD_LIGHT = 'hard-light',
    SOFT_LIGHT = 'soft-light',
    DIFFERENCE = 'difference',
    EXCLUSION = 'exclusion',
    HUE = 'hue',
    SATURATION = 'saturation',
    COLOR = 'color',
    LUMINOSITY = 'luminosity',
    INITIAL = 'initial',
    INHERIT = 'inherit',
    REVERT = 'revert',
    UNSET = 'unset'
}

export const mixBlendMode: IPropertyIdentValueDescriptor<MIX_BLEND_MODE> = {
    name: 'mix-blend-mode',
    initialValue: 'normal',
    prefix: false,
    type: PropertyDescriptorParsingType.IDENT_VALUE,
    parse: (_context: Context, mode: string) => {
        switch (mode) {
            case 'multiply':
                return MIX_BLEND_MODE.MULTIPLY;
            case 'screen':
                return MIX_BLEND_MODE.SCREEN;
            case 'overlay':
                return MIX_BLEND_MODE.OVERLAY;
            case 'darken':
                return MIX_BLEND_MODE.DARKEN;
            case 'lighten':
                return MIX_BLEND_MODE.LIGHTEN;
            case 'color-dodge':
                return MIX_BLEND_MODE.COLOR_DODGE;
            case 'color-burn':
                return MIX_BLEND_MODE.COLOR_BURN;
            case 'hard-light':
                return MIX_BLEND_MODE.HARD_LIGHT;
            case 'soft-light':
                return MIX_BLEND_MODE.SOFT_LIGHT;
            case 'difference':
                return MIX_BLEND_MODE.DIFFERENCE;
            case 'exclusion':
                return MIX_BLEND_MODE.EXCLUSION;
            case 'hue':
                return MIX_BLEND_MODE.HUE;
            case 'saturation':
                return MIX_BLEND_MODE.SATURATION;
            case 'color':
                return MIX_BLEND_MODE.COLOR;
            case 'luminosity':
                return MIX_BLEND_MODE.LUMINOSITY;
            case 'initial':
                return MIX_BLEND_MODE.INITIAL;
            case 'inherit':
                return MIX_BLEND_MODE.INHERIT;
            case 'revert':
                return MIX_BLEND_MODE.REVERT;
            case 'unset':
                return MIX_BLEND_MODE.UNSET;
            case 'normal':
            default:
                return MIX_BLEND_MODE.NORMAL;
        }
    }
};
