/*
  html2canvas @VERSION@ <http://html2canvas.hertzen.com>
  Copyright (c) 2011 Niklas von Hertzen. All rights reserved.
  http://www.twitter.com/niklasvh

  Released under MIT License
*/

(function(){

html2canvas.Util = {};

html2canvas.Util.backgroundImage = function (src) {
  
    if (/data:image\/.*;base64,/i.test( src ) || /^(-webkit|-moz|linear-gradient|-o-)/.test( src )) {
        return src;
    }
    
    if (src.toLowerCase().substr( 0, 5 ) === 'url("') {
        src = src.substr( 5 );
        src = src.substr( 0, src.length - 2 );                 
    } else {
        src = src.substr( 4 );
        src = src.substr( 0, src.length - 1 );  
    }

    return src;  
};

html2canvas.Util.Bounds = function getBounds (el) {
    var clientRect,
    bounds = {};
        
    if (el.getBoundingClientRect){    
        clientRect = el.getBoundingClientRect();

            
        // TODO add scroll position to bounds, so no scrolling of window necessary
        bounds.top = clientRect.top;
        bounds.bottom = clientRect.bottom || (clientRect.top + clientRect.height);
        bounds.left = clientRect.left;
        bounds.width = clientRect.width;
        bounds.height = clientRect.height;
    
        return bounds;
            
    } /*else{
           
           
            p = $(el).offset();       
          
            return {               
                left: p.left + getCSS(el,"borderLeftWidth", true),
                top: p.top + getCSS(el,"borderTopWidth", true),
                width:$(el).innerWidth(),
                height:$(el).innerHeight()                
            };
            

        }     */      
};

var ua = navigator.userAgent.toLowerCase(),
    platform = navigator.platform.toLowerCase(),
	UA = ua.match(/(opera|ie|firefox|chrome|version)[\s\/:]([\w\d\.]+)?.*?(safari|version[\s\/:]([\w\d\.]+)|$)/) || [null, 'unknown', 0],
	mode = UA[1] == 'ie' && document.documentMode;
    
html2canvas.Util.Browser = {

	name: (UA[1] == 'version') ? UA[3] : UA[1],

	version: mode || parseFloat((UA[1] == 'opera' && UA[4]) ? UA[4] : UA[2]),

	Platform: {
		name: ua.match(/ip(?:ad|od|hone)/) ? 'ios' : (ua.match(/(?:webos|android)/) || platform.match(/mac|win|linux/) || ['other'])[0]
	}
};


var html = document.documentElement;
var floatName = (html.style.cssFloat == null) ? 'styleFloat' : 'cssFloat';
var hasOpacity = (html.style.opacity != null),
    hasFilter = (html.style.filter != null),
	reAlpha = /alpha\(opacity=([\d.]+)\)/i;

var styles = {
    left: '@px', top: '@px', bottom: '@px', right: '@px',
	width: '@px', height: '@px', maxWidth: '@px', maxHeight: '@px', minWidth: '@px', minHeight: '@px',
	backgroundColor: 'rgb(@, @, @)', backgroundPosition: '@px @px', color: 'rgb(@, @, @)',
	fontSize: '@px', letterSpacing: '@px', lineHeight: '@px', clip: 'rect(@px @px @px @px)',
	margin: '@px @px @px @px', padding: '@px @px @px @px', border: '@px @ rgb(@, @, @) @px @ rgb(@, @, @) @px @ rgb(@, @, @)',
	borderWidth: '@px @px @px @px', borderStyle: '@ @ @ @', borderColor: 'rgb(@, @, @) rgb(@, @, @) rgb(@, @, @) rgb(@, @, @)',
	zIndex: '@', 'zoom': '@', fontWeight: '@', textIndent: '@px', opacity: '@'
};
var shortStyles = {margin: {}, padding: {}, border: {}, borderWidth: {}, borderStyle: {}, borderColor: {}};

if(!Array.prototype.forEach){
    Array.prototype.forEach = function(fn){
        var len = this.length;
        if(typeof fn != 'function') throw new TypeError();
        var thisp = arguments[1];
        for(var i = 0; i < len; i++){
            if(i in this) fn.call(thisp, this[i], i, this);
        }
    };
}

['Top', 'Right', 'Bottom', 'Left'].forEach(function(direction){
	['margin', 'padding'].forEach(function(style){
		var sd = style + direction;
		shortStyles[style][sd] = styles[sd] = '@px';
	});
	var bd = 'border' + direction;
	shortStyles.border[bd] = styles[bd] = '@px @ rgb(@, @, @)';
	var bdw = bd + 'Width', bds = bd + 'Style', bdc = bd + 'Color';
	shortStyles[bd] = {};
	shortStyles.borderWidth[bdw] = shortStyles[bd][bdw] = styles[bdw] = '@px';
	shortStyles.borderStyle[bds] = shortStyles[bd][bds] = styles[bds] = '@';
	shortStyles.borderColor[bdc] = shortStyles[bd][bdc] = styles[bdc] = 'rgb(@, @, @)';
});

html2canvas.Util.stringHyphenate = function(string){
	return String(string).replace(/[A-Z]/g, function(match){
		return ('-' + match.charAt(0).toLowerCase());
	});
};

html2canvas.Util.stringCamelCase = function(string){
	return String(string).replace(/-\D/g, function(match){
		return match.charAt(1).toUpperCase();
	});
};

html2canvas.Util.stringCapitalize = function(string){
	return String(string).replace(/\b[a-z]/g, function(match){
		return match.toUpperCase();
	});
};

html2canvas.Util.arrayRgbToHex = function(array){
	if (array.length < 3) return null;
	if (array.length == 4 && array[3] == 0) return 'transparent';
	var hex = [];
	for (var i = 0; i < 3; i++){
		var bit = (array[i] - 0).toString(16);
		hex.push((bit.length == 1) ? '0' + bit : bit);
	}
	return '#' + hex.join('');
};

html2canvas.Util.stringRgbToHex = function(string){
	var rgb = String(string).match(/\d{1,3}/g);
	return (rgb) ? html2canvas.Util.arrayRgbToHex(rgb) : null;
};

html2canvas.Util.getComputedStyle = function(el, property){
    if (el.currentStyle) return el.currentStyle[html2canvas.Util.stringCamelCase(property)];
	var defaultView = el.ownerDocument.defaultView,
		computed = defaultView ? defaultView.getComputedStyle(el, null) : null;
	return (computed) ? computed.getPropertyValue((property == floatName) ? 'float' : html2canvas.Util.stringHyphenate(property)) : null;
};

html2canvas.Util.getOpacity = (hasOpacity ? function(el){
    var opacity = el.style.opacity || html2canvas.Util.getComputedStyle(el, 'opacity');
	return (opacity == '') ? 1 : parseFloat(opacity);
} : (hasFilter ? function(el){
	var filter = (el.style.filter || html2canvas.Util.getComputedStyle(el, 'filter')),
		opacity;
	if (filter) opacity = filter.match(reAlpha);
	return (opacity == null || filter == null) ? 1 : (opacity[1] / 100);
} : function(el){
	var opacity = (el.style.visibility == 'hidden' ? 0 : 1);
	return opacity;
}));

html2canvas.Util.getCSS = function (el, property) {
    if (property == 'opacity') return html2canvas.Util.getOpacity(el);
	property = html2canvas.Util.stringCamelCase(property == 'float' ? floatName : property);
	var result = el.style[property];
	if (!result || property == 'zIndex'){
		result = [];
		for (var style in shortStyles){
			if (property != style) continue;
			for (var s in shortStyles[style]) result.push(el.getStyle(s));
			return result.join(' ');
		}
		result = html2canvas.Util.getComputedStyle(el, property);
	}
	if (result){
		result = String(result);
		var color = result.match(/rgba?\([\d\s,]+\)/);
		if (color) result = result.replace(color[0], html2canvas.Util.stringRgbToHex(color[0]));
	}
	if (html2canvas.Util.Browser.name == 'opera' || (html2canvas.Util.Browser.name == 'ie' && isNaN(parseFloat(result)))){
		if ((/^(height|width)$/).test(property)){
			var values = (property == 'width') ? ['left', 'right'] : ['top', 'bottom'], size = 0;
			values.each(function(value){
				size += parseInt(html2canvas.Util.getCSS(el, 'border-' + value + '-width'), 10) + parseInt(html2canvas.Util.getCSS(el, 'padding-' + value), 10);
			}, el);
			return el['offset' + html2canvas.Util.stringCapitalize(property)] - size + 'px';
		}
		if (html2canvas.Util.Browser.name == 'opera' && String(result).indexOf('px') != -1) return result;
		if ((/^border(.+)Width|margin|padding/).test(property)) return '0px';
	}
	return result;
};

html2canvas.Util.Extend = function (options, defaults) {
    var key;
    for (key in options) {              
        if (options.hasOwnProperty(key)) {
            defaults[key] = options[key];
        }
    }
    return defaults;           
};

html2canvas.Util.Children = function(el) {
    // $(el).contents() !== el.childNodes, Opera / IE have issues with that
    var children;
    try {
      children = $(el).contents();
    } catch (ex) {
      html2canvas.log("html2canvas.Util.Children failed with exception: " + ex.message);
      children = [];
    }
    return children;
}

})();