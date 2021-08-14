const elementDebuggerAttribute = 'data-html2canvas-debug';
export const enum DebuggerType {
    NONE,
    ALL,
    CLONE,
    PARSE,
    RENDER
}

const getElementDebugType = (element: Element): DebuggerType => {
    const attribute = element.getAttribute(elementDebuggerAttribute);
    switch (attribute) {
        case 'all':
            return DebuggerType.ALL;
        case 'clone':
            return DebuggerType.CLONE;
        case 'parse':
            return DebuggerType.PARSE;
        case 'render':
            return DebuggerType.RENDER;
        default:
            return DebuggerType.NONE;
    }
};

export const isDebugging = (element: Element, type: Omit<DebuggerType, DebuggerType.NONE>): boolean => {
    const elementType = getElementDebugType(element);
    return elementType === DebuggerType.ALL || type === elementType;
};
