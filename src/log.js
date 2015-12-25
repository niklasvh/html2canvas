function log() {
    if (log.enabled && window.console && window.console.log) {
        Function.prototype.bind.call(window.console.log, (window.console)).apply(window.console, [(Date.now() - log.start) + "ms", "html2canvas:"].concat([].slice.call(arguments, 0)));
    }
}
module.exports = log;
