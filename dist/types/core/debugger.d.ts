export declare const enum DebuggerType {
    NONE = 0,
    ALL = 1,
    CLONE = 2,
    PARSE = 3,
    RENDER = 4
}
export declare const isDebugging: (element: Element, type: Omit<DebuggerType, DebuggerType.NONE>) => boolean;
