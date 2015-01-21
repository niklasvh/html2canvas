if (typeof(document) === "undefined" || typeof(Object.create) !== "function" || typeof(document.createElement("canvas").getContext) !== "function") {
    (window || module.exports).html2canvas = function() {
        return Promise.reject("No canvas support");
    };
    return;
}
