/* @flow */
'use strict';
import Length from '../Length';

const toFloat = (s: string): number => parseFloat(s.trim());

export type Matrix = [number, number, number, number, number, number];
export type TransformOrigin = [Length, Length];
export type Transform = {
    transform: Matrix,
    transformOrigin: TransformOrigin
} | null;

const MATRIX = /(matrix|matrix3d)\((.+)\)/;

export const parseTransform = (style: CSSStyleDeclaration): Transform => {
    // TODO get prefixed values
    const transform = parseTransformMatrix(style.transform);
    if (transform === null) {
        return null;
    }

    return {
        transform,
        transformOrigin: parseTransformOrigin(style.transformOrigin)
    };
};

const parseTransformOrigin = (origin: string): TransformOrigin => {
    const values = origin.split(' ').map(Length.create);
    return [values[0], values[1]];
};

const parseTransformMatrix = (transform: ?string): Matrix | null => {
    if (transform === 'none' || typeof(transform) !== 'string') {
        return null;
    }

    const match = transform.match(MATRIX);
    if (match) {
        if (match[1] === 'matrix') {
            const matrix = match[2].split(',').map(toFloat);
            return [matrix[0], matrix[1], matrix[2], matrix[3], matrix[4], matrix[5]];
        } else {
            const matrix3d = match[2].split(',').map(toFloat);
            return [matrix3d[0], matrix3d[1], matrix3d[4], matrix3d[5], matrix3d[12], matrix3d[13]];
        }
    }
    return null;
};
