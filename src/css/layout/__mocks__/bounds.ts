export const {Bounds} = jest.requireActual('../bounds');
export const parseBounds = (): typeof Bounds[] => {
    return [new Bounds(0, 0, 200, 50)];
};

export const parseBound = (): typeof Bounds => {
    return new Bounds(0, 0, 200, 50);
};
