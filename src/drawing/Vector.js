/* @flow */
'use strict';
import type {Drawable} from './Path';
import {PATH} from './Path';

export default class Vector implements Drawable<0> {
    type: 0;
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.type = PATH.VECTOR;
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
