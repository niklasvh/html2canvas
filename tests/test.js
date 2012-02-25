/*
  html2canvas @VERSION@ <http://html2canvas.hertzen.com>
  Copyright (c) 2011 Niklas von Hertzen. All rights reserved.
  http://www.twitter.com/niklasvh

  Released under MIT License
*/
(function(document, window) {
  var scrStart = '<script type="text/javascript" src="', scrEnd = '"></script>';
  document.write(scrStart + '../external/jquery-1.6.2.js' + scrEnd);
  var html2canvas = ['Core', 'Generate', 'Parse', 'Preload', 'Queue', 'Renderer', 'plugins/jquery.plugin.html2canvas'], i;
  for (i = 0; i < html2canvas.length; ++i) {
    document.write(scrStart + '../src/' + html2canvas[i] + '.js' + scrEnd);
  }
  window.onload = function() {
    if (window.setUp) {
      window.setUp();
    }
    setTimeout(function() {
      $(document.body).html2canvas({
        logging: true,
        profile: true
      });
    }, 100);
  };
}(document, window));
