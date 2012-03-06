/*
  html2canvas @VERSION@ <http://html2canvas.hertzen.com>
  Copyright (c) 2011 Niklas von Hertzen. All rights reserved.
  http://www.twitter.com/niklasvh

  Released under MIT License
 */
"use strict";

var _html2canvas = {},
html2canvas;


function h2clog(a) {
    if (_html2canvas.logging && window.console && window.console.log) {
        window.console.log(a);
    }
}

_html2canvas.Util = {};

_html2canvas.Util.backgroundImage = function (src) {
  
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

_html2canvas.Util.Bounds = function getBounds (el) {
    var clientRect,
    bounds = {};
        
    if (el.getBoundingClientRect){	
        clientRect = el.getBoundingClientRect();

            
        // TODO add scroll position to bounds, so no scrolling of window necessary
        bounds.top = clientRect.top;
        bounds.bottom = clientRect.bottom || (clientRect.top + clientRect.height);
        bounds.left = clientRect.left;
        
        // older IE doesn't have width/height, but top/bottom instead
        bounds.width = clientRect.width || (clientRect.right - clientRect.left);
        bounds.height = clientRect.height || (clientRect.bottom - clientRect.top);
    
        return bounds;
            
    }       
};

_html2canvas.Util.getCSS = function (el, attribute) {
    // return $(el).css(attribute);
    
    var val;
    
    function toPX( attribute, val ) {
        var rsLeft = el.runtimeStyle && el.runtimeStyle[ attribute ],
        left,
        style = el.style;
                
        // Check if we are not dealing with pixels, (Opera has issues with this)
        // Ported from jQuery css.js
        // From the awesome hack by Dean Edwards
        // http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291

        // If we're not dealing with a regular pixel number
        // but a number that has a weird ending, we need to convert it to pixels   
        
        if ( !/^-?[0-9]+\.?[0-9]*(?:px)?$/i.test( val ) && /^-?\d/.test( val ) ) {

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
            }

        }
        
        if (!/^(thin|medium|thick)$/i.test( val )) {
            return Math.round(parseFloat( val )) + "px";
        } 
        
        return val;
     
    }
    
    
    if ( window.getComputedStyle ) {
        val = document.defaultView.getComputedStyle(el, null)[ attribute ];
        
        if ( attribute === "backgroundPosition" ) {
            
            val = (val.split(",")[0] || "0 0").split(" ");
          
            val[ 0 ] = ( val[0].indexOf( "%" ) === -1 ) ? toPX(  attribute + "X", val[ 0 ] ) : val[ 0 ];
            val[ 1 ] = ( val[1] === undefined ) ? val[0] : val[1]; // IE 9 doesn't return double digit always
            val[ 1 ] = ( val[1].indexOf( "%" ) === -1 ) ? toPX(  attribute + "Y", val[ 1 ] ) : val[ 1 ];
        } 
        
    } else if ( el.currentStyle ) {
        // IE 9>       
        if (attribute === "backgroundPosition") {
            // Older IE uses -x and -y 
            val = [ toPX(  attribute + "X", el.currentStyle[ attribute + "X" ]  ), toPX(  attribute + "Y", el.currentStyle[ attribute + "Y" ]  ) ];  
        } else {

            val = toPX(  attribute, el.currentStyle[ attribute ]  );
            
            if (/^(border)/i.test( attribute ) && /^(medium|thin|thick)$/i.test( val )) {
                switch (val) {
                    case "thin":
                        val = "1px";
                        break;
                    case "medium":
                        val = "0px"; // this is wrong, it should be 3px but IE uses medium for no border as well.. TODO find a work around
                        break;
                    case "thick":
                        val = "5px";
                        break;
                }
            }    
        }



    }



    
    return val;
    

    
//return $(el).css(attribute);
    
  
};


_html2canvas.Util.BackgroundPosition = function ( el, bounds, image ) {
    // TODO add support for multi image backgrounds
    
    var bgposition =  _html2canvas.Util.getCSS( el, "backgroundPosition" ) ,
    topPos,
    left,
    percentage,
    val;
    
    if (bgposition.length === 1){
        val = bgposition;
            
        bgposition = [];
        
        bgposition[0] = val;
        bgposition[1] = val;
    }  

    

    if (bgposition[0].toString().indexOf("%") !== -1){    
        percentage = (parseFloat(bgposition[0])/100);        
        left =  ((bounds.width * percentage)-(image.width*percentage));
      
    }else{
        left = parseInt(bgposition[0],10);
    }

    if (bgposition[1].toString().indexOf("%") !== -1){  

        percentage = (parseFloat(bgposition[1])/100);     
        topPos =  ((bounds.height * percentage)-(image.height*percentage));
    }else{      
        topPos = parseInt(bgposition[1],10);      
    }

    

           
    return {
        top: topPos,
        left: left
    };
         
};

_html2canvas.Util.Extend = function (options, defaults) {
    for (var key in options) {
        if (options.hasOwnProperty(key)) {
            defaults[key] = options[key];
        }
    }
    return defaults;
};

_html2canvas.Util.Children = function(el) {
    // $(el).contents() !== el.childNodes, Opera / IE have issues with that
    var children;
    try {
        children = $(el).contents();
    //children = (el.nodeName && el.nodeName.toUpperCase() === "IFRAME") ? el.contentDocument || el.contentWindow.document :  el.childNodes ;
       
    } catch (ex) {
        h2clog("html2canvas.Util.Children failed with exception: " + ex.message);
        children = [];
    }
    return children;
};
