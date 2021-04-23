declare class MockCache {
    private readonly _cache;
    constructor();
    addImage(src: string): Promise<void>;
}
export declare class CacheStorage {
    static getInstance(): MockCache;
}
export {};
