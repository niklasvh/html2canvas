var webdriver = require("webdriver.js").webdriver,
http = require("http"),
url = require("url"),
path = require("path"),
base64_arraybuffer = require('base64-arraybuffer'),
PNG = require('png-js'),
fs = require("fs"),
port = 5555;

var server = http.createServer(function(request, response) {
  var uri = url.parse(request.url).pathname,
  filename = path.join(process.cwd(), "../" + uri);

  fs.exists(filename, function(exists) {
    if(!exists) {
      response.writeHead(404, {
        "Content-Type": "text/plain"
      });
      response.write("404 Not Found\n");
      response.end();
      return;
    }

    if (fs.statSync(filename).isDirectory()) filename += '/index.html';

    fs.readFile(filename, "binary", function(err, file) {
      if(err) {
        response.writeHead(500, {
          "Content-Type": "text/plain"
        });
        response.write(err + "\n");
        response.end();
        return;
      }

      response.writeHead(200);
      response.write(file, "binary");
      response.end();
    });
  });

}).listen(port);


function getPixelArray(base64, func) {
  var arraybuffer = base64_arraybuffer.decode(base64);
  (new PNG(arraybuffer)).decode(func);
}

var browser = new webdriver({
  logging:false
});


function testPage(url, done) {
  browser.url("http://localhost:" + port + "/tests/" + url + "?selenium")
  .$(".html2canvas", 5000, function(){
    this.execute(function(){
      var canvas = $('.html2canvas')[0];
      return canvas.toDataURL("image/png").substring(22);
    },[], function(dataurl) {
      getPixelArray(dataurl, function(h2cPixels) {
        browser.screenshot(function(base64){
          getPixelArray(base64, function(screenPixels) {
            var len = h2cPixels.length, index = 0, diff = 0;
            for (; index < len; index++) {
              if (screenPixels[index] - h2cPixels[index] !== 0) {
                diff++;
              }
            }
            done(100 - (Math.round((diff/h2cPixels.length) * 10000) / 100));
          });
        })
      });
    });
  });
}

(function(pages) {

  (function processPage(page) {
    testPage(page, function(result) {
      if (pages.length > 0) {
        processPage(pages.shift());
      } else {
        browser.close(function(){
          server.close();
        });
      }
      console.log(page, result);
    });
  })(pages.shift());

})(["overflow.html", "forms.html", "lists.html"]);