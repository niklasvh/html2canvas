function ProxyImageContainer(src, proxy) {
    var callbackName = "html2canvas_" + proxyImageCount++;
    var script = document.createElement("script");
    var link = document.createElement("a");
    link.href = src;
    src = link.href;
    var requestUrl = proxy + ((proxy.indexOf("?") > -1) ? "&" : "?" ) + 'url=' + encodeURIComponent(src) + '&callback=' + callbackName;
    this.src = src;
    this.image = new Image();
    var self = this;
    this.promise = new Promise(function(resolve, reject) {
        self.image.onload = resolve;
        self.image.onerror = reject;

        window[callbackName] = function(a){
            if (a.substring(0,6) === "error:"){
                reject();
            } else {
                self.image.src = a;
            }
            window[callbackName] = undefined; // to work with IE<9  // NOTE: that the undefined callback property-name still exists on the window object (for IE<9)
            try {
                delete window[callbackName];  // for all browser that support this
            } catch(ex) {}
            script.parentNode.removeChild(script);
        };
        script.setAttribute("type", "text/javascript");
        script.setAttribute("src", requestUrl);
        document.body.appendChild(script);
    })['catch'](function() {
        var dummy = new DummyImageContainer(src);
        return dummy.promise.then(function(image) {
            self.image = image;
        });
    });
}

var proxyImageCount = 0;
