import { IPath, Path, PathType } from './path';
export declare class Vector implements IPath {
    type: PathType;
    x: number;
    y: number;
    constructor(x: number, y: number);
    add(deltaX: number, deltaY: number): Vector;
}
export declare const isVector: (path: Path) => path is Vector;
