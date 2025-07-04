import {IPropertyListDescriptor, PropertyDescriptorParsingType} from '../IPropertyDescriptor';
import {CSSValue, isIdentToken} from '../syntax/parser';
import {DimensionToken, NumberValueToken, TokenType} from '../syntax/tokenizer';
import {Context} from '../../core/context';

export interface FilterFunction {
    name: string;
    values: number[];
}

export type Filter = FilterFunction[] | null;

export const filter: IPropertyListDescriptor<Filter> = {
    name: 'filter',
    initialValue: 'none',
    prefix: true,
    type: PropertyDescriptorParsingType.LIST,
    parse: (_context: Context, tokens: CSSValue[]): Filter => {
        if (tokens.length === 1 && isIdentToken(tokens[0]) && tokens[0].value === 'none') {
            return null;
        }

        const filters: FilterFunction[] = [];
        
        for (const token of tokens) {
            if (token.type === TokenType.FUNCTION) {
                const filterFunction = parseFilterFunction(token.name, token.values);
                if (filterFunction) {
                    filters.push(filterFunction);
                }
            }
        }

        return filters.length > 0 ? filters : null;
    }
};

const parseFilterFunction = (name: string, values: CSSValue[]): FilterFunction | null => {
    const supportedFunctions = [
        'blur', 'brightness', 'contrast', 'drop-shadow', 'grayscale', 
        'hue-rotate', 'invert', 'opacity', 'saturate', 'sepia'
    ];
    
    if (!supportedFunctions.includes(name)) {
        return null;
    }

    const parsedValues: number[] = [];

    switch (name) {
        case 'blur':
            // blur(5px) - expects length value
            if (values.length === 1) {
                const value = parseLength(values[0]);
                if (value !== null) {
                    parsedValues.push(value);
                }
            }
            break;
            
        case 'brightness':
        case 'contrast':
        case 'grayscale':
        case 'invert':
        case 'saturate':
        case 'sepia':
            // These functions expect percentage or number
            if (values.length === 1) {
                const value = parsePercentageOrNumber(values[0]);
                if (value !== null) {
                    parsedValues.push(value);
                }
            }
            break;
            
        case 'hue-rotate':
            // hue-rotate(90deg) - expects angle value
            if (values.length === 1) {
                const value = parseAngle(values[0]);
                if (value !== null) {
                    parsedValues.push(value);
                }
            }
            break;
            
        case 'opacity':
            // opacity(50%) - expects percentage or number
            if (values.length === 1) {
                const value = parsePercentageOrNumber(values[0]);
                if (value !== null) {
                    parsedValues.push(Math.max(0, Math.min(1, value)));
                }
            }
            break;
            
        case 'drop-shadow':
            // drop-shadow(2px 2px 4px rgba(0,0,0,0.5)) - expects offset-x, offset-y, blur-radius, color
            // For now, we'll parse the first 3 values as lengths (x, y, blur) and ignore color
            if (values.length >= 2) {
                const x = parseLength(values[0]);
                const y = parseLength(values[1]);
                const blur = values.length > 2 ? parseLength(values[2]) : 0;
                
                if (x !== null && y !== null && blur !== null) {
                    parsedValues.push(x, y, blur);
                }
            }
            break;
    }

    return parsedValues.length > 0 ? { name, values: parsedValues } : null;
};

const parseLength = (value: CSSValue): number | null => {
    if (value.type === TokenType.DIMENSION_TOKEN) {
        const dimension = value as DimensionToken;
        // Convert to pixels (simplified)
        switch (dimension.unit) {
            case 'px':
                return dimension.number;
            case 'em':
                return dimension.number * 16; // Rough approximation
            case 'rem':
                return dimension.number * 16; // Rough approximation
            default:
                return dimension.number;
        }
    }
    if (value.type === TokenType.NUMBER_TOKEN) {
        return (value as NumberValueToken).number;
    }
    return null;
};

const parsePercentageOrNumber = (value: CSSValue): number | null => {
    if (value.type === TokenType.PERCENTAGE_TOKEN) {
        return (value as any).number / 100;
    }
    if (value.type === TokenType.NUMBER_TOKEN) {
        return (value as NumberValueToken).number;
    }
    return null;
};

const parseAngle = (value: CSSValue): number | null => {
    if (value.type === TokenType.DIMENSION_TOKEN) {
        const dimension = value as DimensionToken;
        // Convert to degrees
        switch (dimension.unit) {
            case 'deg':
                return dimension.number;
            case 'rad':
                return dimension.number * 180 / Math.PI;
            case 'turn':
                return dimension.number * 360;
            default:
                return dimension.number;
        }
    }
    if (value.type === TokenType.NUMBER_TOKEN) {
        return (value as NumberValueToken).number;
    }
    return null;
};
