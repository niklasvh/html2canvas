/* @flow */
'use strict';

export type zIndex = {
    auto: boolean,
    order: number
};

export const parseZIndex = (zIndex: string): zIndex => {
    const auto = zIndex === 'auto';
    return {
        auto,
        order: auto ? 0 : parseInt(zIndex, 10)
    };
};
