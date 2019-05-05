import {CSSValue} from '../syntax/parser';
import {TokenType} from '../syntax/tokenizer';
import {ITypeDescriptor} from '../ITypeDescriptor';

export const angle: ITypeDescriptor<number> = {
    name: 'angle',
    parse: (value: CSSValue): number => {
        if (value.type === TokenType.DIMENSION_TOKEN) {
            switch (value.unit) {
                case 'deg':
                    return (Math.PI * value.number) / 180;
                case 'grad':
                    return (Math.PI / 200) * value.number;
                case 'rad':
                    return value.number;
                case 'turn':
                    return Math.PI * 2 * value.number;
            }
        }

        throw new Error(`Unsupported angle type`);
    }
};

export const isAngle = (value: CSSValue): boolean => {
    if (value.type === TokenType.DIMENSION_TOKEN) {
        if (value.unit === 'deg' || value.unit === 'grad' || value.unit === 'rad' || value.unit === 'turn') {
            return true;
        }
    }
    return false;
};

const SIDE_ANGLES: {[key: string]: number} = {
    top: 360,
    right: 90,
    bottom: 180,
    left: 270
};

export const parseNamedSide = (idents: CSSValue[]): number => {
    const namedAngleSum = idents.reduce((angle, sideToken) => {
        if (sideToken.type === TokenType.IDENT_TOKEN && typeof SIDE_ANGLES[sideToken.value] !== 'undefined') {
            return angle + SIDE_ANGLES[sideToken.value];
        }
        return angle;
    }, 0);
    return deg(namedAngleSum === 450 ? 45 : (namedAngleSum / idents.length) % 360);
};

export const deg = (deg: number): number => (Math.PI * deg) / 180;
