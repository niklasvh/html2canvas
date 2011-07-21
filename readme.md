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