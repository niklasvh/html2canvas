var html2canvas = {};

html2canvas.logging = true;

html2canvas.log = function (a) {    
    if (html2canvas.logging) {    
        window.console.log(a);
    }
};    

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
        
    window.scroll(0,0);
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
}

html2canvas.Util.getCSS = function (el, attribute) {
    // return jQuery(el).css(attribute);
    /*
    var val,
    left,
    rsLeft = el.runtimeStyle && el.runtimeStyle[ attribute ],
    style = el.style;
    
    if ( el.currentStyle ) {
        val = el.currentStyle[ attribute ];
    } else if (window.getComputedStyle) {
        val = document.defaultView.getComputedStyle(el, null)[ attribute ];
    }
    */
    // Check if we are not dealing with pixels, (Opera has issues with this)
    // Ported from jQuery css.js
    // From the awesome hack by Dean Edwards
    // http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291

    // If we're not dealing with a regular pixel number
    // but a number that has a weird ending, we need to convert it to pixels
    
    // if ( !/^-?\d+(?:px)?$/i.test( val ) && /^-?\d/.test( val ) ) {
    /*
        // Remember the original values
        left = style.left;

        // Put in the new values to get a computed value out
        if ( rsLeft ) {
            el.runtimeStyle.left = el.currentStyle.left;
        }
        style.left = attribute === "fontSize" ? "1em" : (val || 0);
        val = style.pixelLeft + "px";

        // Revert the changed values
        style.left = left;
        if ( rsLeft ) {
            el.runtimeStyle.left = rsLeft;
        }*/
    val = $(el).css(attribute);
    // }
    return val;
    
  
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
    return $(el).contents();
}