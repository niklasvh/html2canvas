import {CSSValue, isIdentToken} from '../syntax/parser';
import {TokenType} from '../syntax/tokenizer';
import {ITypeDescriptor} from '../ITypeDescriptor';
import {HUNDRED_PERCENT, ZERO_LENGTH} from './length-percentage';
import {GradientCorner} from './image';

const DEG = 'deg';
const GRAD = 'grad';
const RAD = 'rad';
const TURN = 'turn';

export const angle: ITypeDescriptor<number> = {
    name: 'angle',
    parse: (value: CSSValue): number => {
        if (value.type === TokenType.DIMENSION_TOKEN) {
            switch (value.unit) {
                case DEG:
                    return (Math.PI * value.number) / 180;
                case GRAD:
                    return (Math.PI / 200) * value.number;
                case RAD:
                    return value.number;
                case TURN:
                    return Math.PI * 2 * value.number;
            }
        }

        throw new Error(`Unsupported angle type`);
    }
};

export const isAngle = (value: CSSValue): boolean => {
    if (value.type === TokenType.DIMENSION_TOKEN) {
        if (value.unit === DEG || value.unit === GRAD || value.unit === RAD || value.unit === TURN) {
            return true;
        }
    }
    return false;
};

export const parseNamedSide = (tokens: CSSValue[]): number | GradientCorner => {
    const sideOrCorner = tokens
        .filter(isIdentToken)
        .map((ident) => ident.value)
        .join(' ');

    switch (sideOrCorner) {
        case 'to bottom right':
        case 'to right bottom':
        case 'left top':
        case 'top left':
            return [ZERO_LENGTH, ZERO_LENGTH];
        case 'to top':
        case 'bottom':
            return deg(0);
        case 'to bottom left':
        case 'to left bottom':
        case 'right top':
        case 'top right':
            return [ZERO_LENGTH, HUNDRED_PERCENT];
        case 'to right':
        case 'left':
            return deg(90);
        case 'to top left':
        case 'to left top':
        case 'right bottom':
        case 'bottom right':
            return [HUNDRED_PERCENT, HUNDRED_PERCENT];
        case 'to bottom':
        case 'top':
            return deg(180);
        case 'to top right':
        case 'to right top':
        case 'left bottom':
        case 'bottom left':
            return [HUNDRED_PERCENT, ZERO_LENGTH];
        case 'to left':
        case 'right':
            return deg(270);
    }

    return 0;
};

export const deg = (deg: number): number => (Math.PI * deg) / 180;
