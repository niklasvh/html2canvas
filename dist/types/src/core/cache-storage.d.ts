export declare class CacheStorage {
    private static _caches;
    private static _link?;
    private static _origin;
    private static _current;
    static create(name: string, options: ResourceOptions): Cache;
    static destroy(name: string): void;
    static open(name: string): Cache;
    static getOrigin(url: string): string;
    static isSameOrigin(src: string): boolean;
    static setContext(window: Window): void;
    static getInstance(): Cache;
    static attachInstance(cache: Cache): void;
    static detachInstance(): void;
}
export interface ResourceOptions {
    imageTimeout: number;
    useCORS: boolean;
    allowTaint: boolean;
    proxy?: string;
}
export declare class Cache {
    private readonly _cache;
    private readonly _options;
    private readonly id;
    constructor(id: string, options: ResourceOptions);
    addImage(src: string): Promise<void>;
    match(src: string): Promise<any>;
    private loadImage;
    private has;
    keys(): Promise<string[]>;
    private proxy;
}
