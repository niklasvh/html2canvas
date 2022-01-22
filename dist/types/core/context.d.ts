import { Logger } from './logger';
import { Cache, ResourceOptions } from './cache-storage';
import { Bounds } from '../css/layout/bounds';
export declare type ContextOptions = {
    logging: boolean;
    cache?: Cache;
} & ResourceOptions;
export declare class Context {
    windowBounds: Bounds;
    private readonly instanceName;
    readonly logger: Logger;
    readonly cache: Cache;
    private static instanceCount;
    constructor(options: ContextOptions, windowBounds: Bounds);
}
