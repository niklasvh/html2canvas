/* @flow */
'use strict';

export default class Vector {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        if (__DEV__) {
            if (isNaN(x)) {
                console.error(`Invalid x value given for Vector`);
            }
            if (isNaN(y)) {
                console.error(`Invalid y value given for Vector`);
            }
        }
    }
}
