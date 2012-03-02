html2canvas
===========

#### JavaScript HTML renderer ####
       
 This script allows you to take "screenshots" of webpages or parts of it, directly on the users browser. The screenshot is based on the DOM and as such may not be 100% accurate to the real representation as it does not make an actual screenshot, but builds the screenshot based on the information available on the page.


###How does it work?###
The script renders the current page as a canvas image, by reading the DOM and the different styles applied to the elements. However, as many elements are displayed differently on different browsers and operating systems (such as form elements such as radio buttons or checkboxes) as well as 

It does <b>not require any rendering from the server</b>, as the whole image is created on the <b>clients browser</b>. However, for browsers without <code>canvas</code> support alternatives such as <a href="http://flashcanvas.net/">flashcanvas</a> or <a href="http://excanvas.sourceforge.net/">ExplorerCanvas</a> are necessary to create the image. 

Additionally, to render <code>iframe</code> content or images situated outside of the <a href="http://en.wikipedia.org/wiki/Same_origin_policy">same origin policy</a> a proxy will be necessary to load the content to the users browser.

The script is still in a very experimental state, so I don't recommend using it in a production environment nor start building applications with it yet, as there will be still major changes made. However, please do test it out and report your findings, especially if something should be working, but is displaying it incorrectly.
        
###Browser compatibility###

The script should work fine on the following browsers:

* Firefox 3.5+
* Google Chrome 
* Newer versions of Opera (exactly how new is yet to be determined)
* >=IE9 (Older versions compatible with the use of flashcanvas)
        
Note that the compatibility will most likely be increased in future builds, as many of the current restrictions have at least partial work arounds, which can be used with older browser versions.

###So what isn't included yet?###
    
There are still a lot of CSS properties missing, including most CSS3 properties such as <code>text-shadow</code>, <code>box-radius</code> etc. as well as all elements created by the browser, such as radio and checkbox buttons and list icons. I will compile a full list of supported elements and CSS properties soon. 
 There is no support for <code>frame</code> and <code>object</code> content such as Flash.

### Examples ###

For more information and examples, please visit the <a href="http://html2canvas.hertzen.com">homepage</a> or try the <a href="http://html2canvas.hertzen.com/screenshots.html">test console</a>.

### Changelog ###

v0.34 - 

* Split renderers to their own objects (<a href="https://github.com/niklasvh/html2canvas/commit/94f2f799a457cd29a21cc56ef8c06f1697866739">niklasvh</a>)
* Simplified API, cleaned up code (<a href="https://github.com/niklasvh/html2canvas/commit/c7d526c9eaa6a4abf4754d205fe1dee360c7660e">niklasvh</a>)

v0.33 - 2.3.2012

* SVG taint fix, and additional taint testing options for rendering (<a href="https://github.com/niklasvh/html2canvas/commit/2dc8b9385e656696cb019d615bdfa1d98b17d5d4">niklasvh</a>)
* Added support for CORS images and option to create canvas as tainted (<a href="https://github.com/niklasvh/html2canvas/commit/3ad49efa0032cde25c6ed32a39e35d1505d3b2ef">niklasvh</a>)
* Improved minification saved ~1K! (<a href="https://github.com/cobexer/html2canvas/commit/b82be022b2b9240bd503e078ac980bde2b953e43">cobexer</a>)
* Added integrated support for Flashcanvas (<a href="https://github.com/niklasvh/html2canvas/commit/e9257191519f67d74fd5e364d8dee3c0963ba5fc">niklasvh</a>)
* Fixed a variety of legacy IE bugs (<a href="https://github.com/niklasvh/html2canvas/commit/b65357c55d0701017bafcd357bc654b54d458f8f">niklasvh</a>)

v0.32 - 20.2.2012

* Added changelog!
* Added bookmarklet (<a href="https://github.com/niklasvh/html2canvas/commit/b320dd306e1a2d32a3bc5a71b6ebf6d8c060cde5">cobexer</a>)
* Option to select single element to render (<a href="https://github.com/niklasvh/html2canvas/commit/0cb252ada91c84ef411288b317c03e97da1f12ad">niklasvh</a>)
* Fixed closure compiler warnings (<a href="https://github.com/niklasvh/html2canvas/commit/36ff1ec7aadcbdf66851a0b77f0b9e87e4a8e4a1">cobexer</a>)
* Enable profiling in FF (<a href="https://github.com/niklasvh/html2canvas/commit/bbd75286a8406cf9e5aea01fdb7950d547edefb9">cobexer</a>)
