export interface FontMetric {
    baseline: number;
    middle: number;
}
export declare class FontMetrics {
    private readonly _data;
    private readonly _document;
    constructor(document: Document);
    private parseMetrics;
    getMetrics(fontFamily: string, fontSize: string): FontMetric;
}
