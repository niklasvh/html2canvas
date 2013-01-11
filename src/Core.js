"use strict";

var _html2canvas = {},
previousElement,
computedCSS,
html2canvas;

function h2clog(a) {
  if (_html2canvas.logging && window.console && window.console.log) {
    window.console.log(a);
  }
}

_html2canvas.Util = {};

_html2canvas.Util.trimText = (function(isNative){
  return function(input){
    if(isNative) { return isNative.apply( input ); }
    else { return ((input || '') + '').replace( /^\s+|\s+$/g , '' ); }
  };
})( String.prototype.trim );

_html2canvas.Util.parseBackgroundImage = function (value) {
    var whitespace = ' \r\n\t',
        method, definition, prefix, prefix_i, block, results = [],
        c, mode = 0, numParen = 0, quote, args;

    var appendResult = function(){
        if(method) {
            if(definition.substr( 0, 1 ) === '"') {
                definition = definition.substr( 1, definition.length - 2 );
            }
            if(definition) {
                args.push(definition);
            }
            if(method.substr( 0, 1 ) === '-' &&
                    (prefix_i = method.indexOf( '-', 1 ) + 1) > 0) {
                prefix = method.substr( 0, prefix_i);
                method = method.substr( prefix_i );
            }
            results.push({
                prefix: prefix,
                method: method.toLowerCase(),
                value: block,
                args: args
            });
        }
        args = []; //for some odd reason, setting .length = 0 didn't work in safari
        method =
            prefix =
            definition =
            block = '';
    };

    appendResult();
    for(var i = 0, ii = value.length; i<ii; i++) {
        c = value[i];
        if(mode === 0 && whitespace.indexOf( c ) > -1){
            continue;
        }
        switch(c) {
            case '"':
                if(!quote) {
                    quote = c;
                }
                else if(quote === c) {
                    quote = null;
                }
                break;

            case '(':
                if(quote) { break; }
                else if(mode === 0) {
                    mode = 1;
                    block += c;
                    continue;
                } else {
                    numParen++;
                }
                break;

            case ')':
                if(quote) { break; }
                else if(mode === 1) {
                    if(numParen === 0) {
                        mode = 0;
                        block += c;
                        appendResult();
                        continue;
                    } else {
                        numParen--;
                    }
                }
                break;

            case ',':
                if(quote) { break; }
                else if(mode === 0) {
                    appendResult();
                    continue;
                }
                else if (mode === 1) {
                    if(numParen === 0 && !method.match(/^url$/i)) {
                        args.push(definition);
                        definition = '';
                        block += c;
                        continue;
                    }
                }
                break;
        }

        block += c;
        if(mode === 0) { method += c; }
        else { definition += c; }
    }
    appendResult();

    return results;
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

_html2canvas.Util.getCSS = function (el, attribute, index) {
  // return $(el).css(attribute);

    var val,
    isBackgroundSizePosition = attribute.match( /^background(Size|Position)$/ );

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

    if (previousElement !== el) {
      computedCSS = document.defaultView.getComputedStyle(el, null);
    }
    val = computedCSS[attribute];

    if (isBackgroundSizePosition) {
      val = (val || '').split( ',' );
      val = val[index || 0] || val[0] || 'auto';
      val = _html2canvas.Util.trimText(val).split(' ');

      if(attribute === 'backgroundSize' && (!val[ 0 ] || val[ 0 ].match( /cover|contain|auto/ ))) {
        //these values will be handled in the parent function

      } else {
        val[ 0 ] = ( val[ 0 ].indexOf( "%" ) === -1 ) ? toPX(  attribute + "X", val[ 0 ] ) : val[ 0 ];
        if(val[ 1 ] === undefined) {
          if(attribute === 'backgroundSize') {
            val[ 1 ] = 'auto';
            return val;
          }
          else {
            // IE 9 doesn't return double digit always
            val[ 1 ] = val[ 0 ];
          }
        }
        val[ 1 ] = ( val[ 1 ].indexOf( "%" ) === -1 ) ? toPX(  attribute + "Y", val[ 1 ] ) : val[ 1 ];
      }
    } else if ( /border(Top|Bottom)(Left|Right)Radius/.test( attribute) ) {
      var arr = val.split(" ");
      if ( arr.length <= 1 ) {
              arr[ 1 ] = arr[ 0 ];
      }
      arr[ 0 ] = parseInt( arr[ 0 ], 10 );
      arr[ 1 ] = parseInt( arr[ 1 ], 10 );
      val = arr;
    }

  return val;
};

_html2canvas.Util.resizeBounds = function( current_width, current_height, target_width, target_height, stretch_mode ){
  var target_ratio = target_width / target_height,
    current_ratio = current_width / current_height,
    output_width, output_height;

  if(!stretch_mode || stretch_mode === 'auto') {
    output_width = target_width;
    output_height = target_height;

  } else {
    if(target_ratio < current_ratio ^ stretch_mode === 'contain') {
      output_height = target_height;
      output_width = target_height * current_ratio;
    } else {
      output_width = target_width;
      output_height = target_width / current_ratio;
    }
  }

  return { width: output_width, height: output_height };
};

function backgroundBoundsFactory( prop, el, bounds, image, imageIndex, backgroundSize ) {
    var bgposition =  _html2canvas.Util.getCSS( el, prop, imageIndex ) ,
    topPos,
    left,
    percentage,
    val;

    if (bgposition.length === 1){
      val = bgposition[0];

      bgposition = [];

      bgposition[0] = val;
      bgposition[1] = val;
    }

    if (bgposition[0].toString().indexOf("%") !== -1){
      percentage = (parseFloat(bgposition[0])/100);
      left = bounds.width * percentage;
      if(prop !== 'backgroundSize') {
        left -= (backgroundSize || image).width*percentage;
      }

    } else {
      if(prop === 'backgroundSize') {
        if(bgposition[0] === 'auto') {
          left = image.width;

        } else {
          if(bgposition[0].match(/contain|cover/)) {
            var resized = _html2canvas.Util.resizeBounds( image.width, image.height, bounds.width, bounds.height, bgposition[0] );
            left = resized.width;
            topPos = resized.height;
          } else {
            left = parseInt (bgposition[0], 10 );
          }
        }

      } else {
        left = parseInt( bgposition[0], 10 );
      }
    }


    if(bgposition[1] === 'auto') {
      topPos = left / image.width * image.height;
    } else if (bgposition[1].toString().indexOf("%") !== -1){
      percentage = (parseFloat(bgposition[1])/100);
      topPos =  bounds.height * percentage;
      if(prop !== 'backgroundSize') {
        topPos -= (backgroundSize || image).height * percentage;
      }

    } else {
      topPos = parseInt(bgposition[1],10);
    }

    return [left, topPos];
}

_html2canvas.Util.BackgroundPosition = function( el, bounds, image, imageIndex, backgroundSize ) {
    var result = backgroundBoundsFactory( 'backgroundPosition', el, bounds, image, imageIndex, backgroundSize );
    return { left: result[0], top: result[1] };
};
_html2canvas.Util.BackgroundSize = function( el, bounds, image, imageIndex ) {
    var result = backgroundBoundsFactory( 'backgroundSize', el, bounds, image, imageIndex );
    return { width: result[0], height: result[1] };
};

_html2canvas.Util.Extend = function (options, defaults) {
  for (var key in options) {
    if (options.hasOwnProperty(key)) {
      defaults[key] = options[key];
    }
  }
  return defaults;
};


/*
 * Derived from jQuery.contents()
 * Copyright 2010, John Resig
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 */
_html2canvas.Util.Children = function( elem ) {


  var children;
  try {

    children = (elem.nodeName && elem.nodeName.toUpperCase() === "IFRAME") ?
    elem.contentDocument || elem.contentWindow.document : (function( array ){
      var ret = [];

      if ( array !== null ) {

        (function( first, second ) {
          var i = first.length,
          j = 0;

          if ( typeof second.length === "number" ) {
            for ( var l = second.length; j < l; j++ ) {
              first[ i++ ] = second[ j ];
            }

          } else {
            while ( second[j] !== undefined ) {
              first[ i++ ] = second[ j++ ];
            }
          }

          first.length = i;

          return first;
        })( ret, array );

      }

      return ret;
    })( elem.childNodes );

  } catch (ex) {
    h2clog("html2canvas.Util.Children failed with exception: " + ex.message);
    children = [];
  }
  return children;
};
