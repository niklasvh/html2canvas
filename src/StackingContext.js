/* @flow */
'use strict';

import NodeContainer from './NodeContainer';
import {POSITION} from './parsing/position';

export default class StackingContext {
    container: NodeContainer;
    parent: ?StackingContext;
    contexts: Array<StackingContext>;
    children: Array<NodeContainer>;
    treatAsRealStackingContext: boolean;

    constructor(
        container: NodeContainer,
        parent: ?StackingContext,
        treatAsRealStackingContext: boolean
    ) {
        this.container = container;
        this.parent = parent;
        this.contexts = [];
        this.children = [];
        this.treatAsRealStackingContext = treatAsRealStackingContext;
    }

    getOpacity(): number {
        return this.parent
            ? this.container.style.opacity * this.parent.getOpacity()
            : this.container.style.opacity;
    }

    getRealParentStackingContext(): StackingContext {
        return !this.parent || this.treatAsRealStackingContext
            ? this
            : this.parent.getRealParentStackingContext();
    }
}
