/* @flow */
'use strict';

export const FILTER_TYPE = {
    UNDEFINED: 'none',
    BRIGHTNESS: 'brightness',
    CONTRAST: 'contrast',
    GRAYSCALE: 'grayscale',
    HUEROTATE: 'hue-rotate',
    INVERT: 'invert',
    OPACITY: 'opacity',
    SATURATION: 'saturation',
    SEPIA: 'sepia'
};

export default class Filter {
    filterTypes: Array<string>;
    values: Array<number>;

    constructor(value: string) {
        var filters = value.split(' ');
        this.filterTypes = filters.map(f => {
            return f.slice(0, f.indexOf('('));
        });
        this.values = filters.map(f => {
            var v = f.slice(f.indexOf('(') + 1, f.indexOf(')'));

            if (v.slice(-1) == '%') {
                //turn % into 0 - 1 values
                v = v.slice(0, -1);
                v = Number(v);
                if (v > 1) v /= 100;
            } else if (v.slice(-3) == 'deg') {
                //turn deg into 0 - 360, for hue-rotate
                v = v.slice(0, -3);
                v = Number(v);
                if (v < 0) v += 360;
                if (v > 360) v -= 360;
            }

            return Number(v);
        });
    }

    isDefined() {
        if (this.filterTypes[0] == FILTER_TYPE.UNDEFINED) return false;
        return true;
    }

    getFilterValue(fType: string) {
        for (var i = 0; i < this.filterTypes.length; i++)
            if (this.filterTypes[i] == fType) return this.values[i];
        return 1;
    }
    hasFilterValue(fType: string) {
        for (var i = 0; i < this.filterTypes.length; i++)
            if (this.filterTypes[i] == fType) return true;
        return false;
    }

    getGrayscale() {
        return this.getFilterValue(FILTER_TYPE.GRAYSCALE);
    }

    getBrightness() {
        return this.getFilterValue(FILTER_TYPE.BRIGHTNESS);
    }

    getOpacity() {
        return this.getFilterValue(FILTER_TYPE.OPACITY);
    }

    getSepia() {
        return this.getFilterValue(FILTER_TYPE.SEPIA);
    }

    getInvert() {
        return this.getFilterValue(FILTER_TYPE.INVERT);
    }

    getContrast() {
        return this.getFilterValue(FILTER_TYPE.CONTRAST);
    }

    getSaturation() {
        return this.getFilterValue(FILTER_TYPE.SATURATION);
    }

    getHueRotate() {
        return this.getFilterValue(FILTER_TYPE.HUEROTATE);
    }

    hasGrayscale() {
        return this.hasFilterValue(FILTER_TYPE.GRAYSCALE);
    }

    hasBrightness() {
        return this.hasFilterValue(FILTER_TYPE.BRIGHTNESS);
    }

    hasOpacity() {
        return this.hasFilterValue(FILTER_TYPE.OPACITY);
    }

    hasSepia() {
        return this.hasFilterValue(FILTER_TYPE.SEPIA);
    }

    hasInvert() {
        return this.hasFilterValue(FILTER_TYPE.INVERT);
    }

    hasContrast() {
        return this.hasFilterValue(FILTER_TYPE.CONTRAST);
    }

    hasSaturation() {
        return this.hasFilterValue(FILTER_TYPE.SATURATION);
    }

    hasHueRotate() {
        return this.hasFilterValue(FILTER_TYPE.HUEROTATE);
    }

    static create(s): Filter {
        return new Filter(s);
    }
}

export const parseFilter = (filterValue: string): Filter => {
    if (filterValue == 'none') return Filter.create(FILTER_TYPE.UNDEFINED);
    return Filter.create(filterValue);
};
