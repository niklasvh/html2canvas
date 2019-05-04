import {IPath, Path, PathType} from './path';

export class Vector implements IPath {
    type: PathType;
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.type = PathType.VECTOR;
        this.x = x;
        this.y = y;
    }
}

export const isVector = (path: Path): path is Vector => path.type === PathType.VECTOR;
