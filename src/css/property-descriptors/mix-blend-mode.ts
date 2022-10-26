import {IPropertyIdentValueDescriptor, PropertyDescriptorParsingType} from '../IPropertyDescriptor';
import {Context} from '../../core/context';

/**
 * Guard function for checking validity of mode and casting as
 * GlobalCompositeOperation if it's a valid value
 *
 * @param mode String value of the css mix-blend-mode
 * @returns boolean
 */
function isGlobalCompositeOperation(mode: string): mode is GlobalCompositeOperation {
    const globalCompositeModes = [
        'color',
        'color-burn',
        'color-dodge',
        'copy',
        'darken',
        'destination-atop',
        'destination-in',
        'destination-out',
        'destination-over',
        'difference',
        'exclusion',
        'hard-light',
        'hue',
        'lighten',
        'lighter',
        'luminosity',
        'multiply',
        'overlay',
        'saturation',
        'screen',
        'soft-light',
        'source-atop',
        'source-in',
        'source-out',
        'source-over',
        'xor'
    ];
    return globalCompositeModes.indexOf(mode) !== -1;
}

export const mixBlendMode: IPropertyIdentValueDescriptor<GlobalCompositeOperation> = {
    name: 'mix-blend-mode',
    initialValue: 'normal',
    prefix: false,
    type: PropertyDescriptorParsingType.IDENT_VALUE,
    parse: (_context: Context, mode: string) => {
        if (isGlobalCompositeOperation(mode)) {
            return mode;
        }
        // This is the default in css
        return 'source-over';
    }
};
