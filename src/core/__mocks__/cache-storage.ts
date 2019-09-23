class MockCache {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private readonly _cache: {[key: string]: Promise<any>};

    constructor() {
        this._cache = {};
    }

    addImage(src: string): Promise<void> {
        const result = Promise.resolve();
        this._cache[src] = result;
        return result;
    }
}

const current = new MockCache();

export class CacheStorage {
    static getInstance(): MockCache {
        return current;
    }
}
