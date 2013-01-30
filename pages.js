var fs = require('fs'),
util = require('util');

var copy = function (src, dst, cb) {
  function copy(err) {
    var is
    , os
    ;


    fs.stat(src, function (err) {
      if (err) {
        return cb(err);
      }
      is = fs.createReadStream(src);
      os = fs.createWriteStream(dst);
      util.pump(is, os, cb);
    });
  }

  fs.stat(dst, copy);
};

copy("index.html", "documentation.html", function() {});
copy("index.html", "screenshots.html", function() {});
copy("index.html", "examples.html", function() {});
copy("index.html", "faq.html", function() {});