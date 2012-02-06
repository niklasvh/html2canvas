/*
  html2canvas @VERSION@ <http://html2canvas.hertzen.com>
  Copyright (c) 2011 Niklas von Hertzen. All rights reserved.
  http://www.twitter.com/niklasvh

  Released under MIT License
*/

var html2canvas = {};

html2canvas.logging = false;

html2canvas.log = function (a) {    
    if (html2canvas.logging && window.console && window.console.log) {
        window.console.log(a);
    }
};
