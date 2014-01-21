function log() {
    if (window.html2canvas.logging && window.console && window.console.log) {
        window.console.log.apply(window.console, [(Date.now() - window.html2canvas.start) + "ms", "html2canvas:"].concat([].slice.call(arguments, 0)));
    }
}
