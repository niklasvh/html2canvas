import {Context} from '../../core/context';
import {IPropertyIdentValueDescriptor, PropertyDescriptorParsingType} from '../IPropertyDescriptor';
export const enum OBJECT_FIT {
    CONTAIN = 'contain',
    COVER = 'cover',
    FILL = 'fill'
}

export const objectFit: IPropertyIdentValueDescriptor<OBJECT_FIT> = {
    name: 'object-fit',
    initialValue: 'fill',
    prefix: false,
    type: PropertyDescriptorParsingType.IDENT_VALUE,
    parse: function (_context: Context, token: string) {
        switch (token) {
            case 'contain':
                return OBJECT_FIT.CONTAIN;
            case 'cover':
                return OBJECT_FIT.COVER;
            default:
                return OBJECT_FIT.FILL;
        }
    }
};

export const getObjectFitSize = (
    contains: boolean /* true = contain, false = cover */,
    containerWidth: number,
    containerHeight: number,
    width: number,
    height: number
): {
    width: number;
    height: number;
    x: number;
    y: number;
} => {
    const doRatio = width / height;
    const cRatio = containerWidth / containerHeight;
    let targetWidth = 0;
    let targetHeight = 0;
    const test = contains ? doRatio > cRatio : doRatio < cRatio;

    if (test) {
        targetWidth = containerWidth;
        targetHeight = targetWidth / doRatio;
    } else {
        targetHeight = containerHeight;
        targetWidth = targetHeight * doRatio;
    }

    return {
        width: targetWidth,
        height: targetHeight,
        x: (containerWidth - targetWidth) / 2,
        y: (containerHeight - targetHeight) / 2
    };
};
