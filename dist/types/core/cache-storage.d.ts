import { Context } from './context';
export declare class CacheStorage {
    private static _link?;
    private static _origin;
    static getOrigin(url: string): string;
    static isSameOrigin(src: string): boolean;
    static setContext(window: Window): void;
}
export interface ResourceOptions {
    imageTimeout: number;
    useCORS: boolean;
    allowTaint: boolean;
    proxy?: string;
}
export declare class Cache {
    private readonly context;
    private readonly _options;
    private readonly _cache;
    constructor(context: Context, _options: ResourceOptions);
    addImage(src: string): Promise<void>;
    match(src: string): Promise<any>;
    private loadImage;
    private has;
    keys(): Promise<string[]>;
    private proxy;
}
