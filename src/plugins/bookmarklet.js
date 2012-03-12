(function() {
    /* options, customize to your needs */
    var server = '//html2canvas.hertzen.com/js',
    proxy = '//html2canvas.appspot.com',
    debug = false,
    profile = false;
    //DEBUG: server = 'http://localhost/html2canvas'; debug = true;
    var debugFiles = [
        'external/jquery-1.6.2.min',
        'src/Core',
        'src/Generate',
        'src/Parse',
        'src/Preload',
        'src/Queue',
        'src/Renderer',
        'src/Util',
        'src/renderers/Canvas',
        'src/plugins/jquery.plugin.html2canvas'
    ],
    relFiles = [
        '//code.jquery.com/jquery-1.6.4.js',
        'html2canvas',
        'jquery.plugin.html2canvas'
    ];
    var loader = {
        index: 0,
        head: document.getElementsByTagName('head')[0],
        statusline: document.createElement('div'),
        files: (debug ? debugFiles : relFiles),
        onload: function () {
            var _ = this;
            if (_.index < _.files.length) {
                var el = document.createElement('script');
                el.type = 'text/javascript';
                el.onload = function() {
                    _.onload();
                };
                el.onerror = function() {
                    _.statusline.style.color = 'red';
                    _.statusline.innerHTML = _.statusline.innerHTML + ' failed';
                    _.statusline.onclick = function() {
                        _.statusline.parentNode.removeChild(_.statusline);
                    };
                };
                if (_.files[_.index].substr(0, 2) === '//') {
                    el.src = _.files[_.index];
                }
                else {
                    el.src = server + '/' + _.files[_.index] + '.js';
                }
                _.head.appendChild(el);
                ++_.index;
                _.statusline.innerHTML = 'html2canvas: loading "' + el.src + '" ' + _.index + ' / ' + _.files.length + '...';
            }
            else {
                _.statusline.parentNode.removeChild(_.statusline);
                delete _.statusline;
                $(document.documentElement).html2canvas({
                    logging: debug,
                    profile: profile,
                    proxy: proxy
                });
            }
        }
    }, statusline = loader.statusline;
    statusline.style.position = 'fixed';
    statusline.style.bottom = '0px';
    statusline.style.right = '20px';
    statusline.style.backgroundColor = 'white';
    statusline.style.border = '1px solid black';
    statusline.style.borderBottomWidth = '0px';
    statusline.style.padding = '2px 5px';
    statusline.style.zIndex = 9999999;
    document.body.appendChild(statusline);
    loader.onload();
}());
