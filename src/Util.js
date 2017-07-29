/* @flow */
'use strict';

export const contains = (bit: number, value: number): boolean => (bit & value) !== 0;
