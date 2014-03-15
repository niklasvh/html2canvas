if (typeof(Object.create) !== "function" || typeof(document.createElement("canvas").getContext) !== "function") {
    window.html2canvas = function() {
        return Promise.reject("No canvas support");
    };
    return;
}
