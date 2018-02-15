/* @flow */
'use strict';

export default class Logger {
    enabled: boolean;
    start: number;
    id: ?string;

    constructor(enabled: boolean, id: ?string, start: ?number) {
        this.enabled = typeof window !== 'undefined' && enabled;
        this.start = start ? start : Date.now();
        this.id = id;
    }

    child(id: string) {
        return new Logger(this.enabled, id, this.start);
    }

    // eslint-disable-next-line flowtype/no-weak-types
    log(...args: any) {
        if (this.enabled && window.console && window.console.log) {
            Function.prototype.bind
                .call(window.console.log, window.console)
                .apply(
                    window.console,
                    [
                        Date.now() - this.start + 'ms',
                        this.id ? `html2canvas (${this.id}):` : 'html2canvas:'
                    ].concat([].slice.call(args, 0))
                );
        }
    }

    // eslint-disable-next-line flowtype/no-weak-types
    error(...args: any) {
        if (this.enabled && window.console && window.console.error) {
            Function.prototype.bind
                .call(window.console.error, window.console)
                .apply(
                    window.console,
                    [
                        Date.now() - this.start + 'ms',
                        this.id ? `html2canvas (${this.id}):` : 'html2canvas:'
                    ].concat([].slice.call(args, 0))
                );
        }
    }
}
