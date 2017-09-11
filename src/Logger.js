/* @flow */
'use strict';

export default class Logger {
    start: number;
    id: ?string;

    constructor(id: ?string, start: ?number) {
        this.start = start ? start : Date.now();
        this.id = id;
    }

    child(id: string) {
        return new Logger(id, this.start);
    }

    // eslint-disable-next-line flowtype/no-weak-types
    log(...args: any) {
        if (window.console && window.console.log) {
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
        if (window.console && window.console.error) {
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
