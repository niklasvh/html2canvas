/* @flow */
'use strict';
import type {Drawable} from './Path';
import {PATH} from './Path';

export default class Circle implements Drawable<2> {
    type: 2;
    x: number;
    y: number;
    radius: number;

    constructor(x: number, y: number, radius: number) {
        this.type = PATH.CIRCLE;
        this.x = x;
        this.y = y;
        this.radius = radius;
        if (__DEV__) {
            if (isNaN(x)) {
                console.error(`Invalid x value given for Circle`);
            }
            if (isNaN(y)) {
                console.error(`Invalid y value given for Circle`);
            }
            if (isNaN(radius)) {
                console.error(`Invalid radius value given for Circle`);
            }
        }
    }
}
