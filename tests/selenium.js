(function(){
  "use strict;"
  var webdriver = require("webdriver.js").webdriver,
  http = require("http"),
  url = require("url"),
  path = require("path"),
  base64_arraybuffer = require('base64-arraybuffer'),
  PNG = require('png-js'),
  fs = require("fs");

  function createServer(port) {
    return http.createServer(function(request, response) {
      var uri = url.parse(request.url).pathname,
      filename = path.join(process.cwd(), uri);

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
  }

  function walkDir(dir, done) {
    var results = [];
    fs.readdir(dir, function(err, list) {
      if (err) return done(err);
      var i = 0;
      (function next() {
        var file = list[i++];
        if (!file) return done(null, results);
        file = dir + '/' + file;
        fs.stat(file, function(err, stat) {
          if (stat && stat.isDirectory()) {
            walkDir(file, function(err, res) {
              results = results.concat(res);
              next();
            });
          } else {
            results.push(file);
            next();
          }
        });
      })();
    });
  };

  function getPixelArray(base64, func) {
    var arraybuffer = base64_arraybuffer.decode(base64);
    (new PNG(arraybuffer)).decode(func);
  }

  function getBaselineFiles() {
    return fs.readdirSync("tests/results/").filter(function(name) {
      return /\.baseline$/.test(name);
    }).map(function(item) {
      return "tests/results/" + item;
    });
  }

  function testPage(browser, url, done) {
    browser.url(url)
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
          });
        });
      });
    });
  }

  var writeResultFile = function(filename, json, append) {
    fs.writeFile(filename + (append || ""), json);
  };

  var openResultFile = function(stats, browser) {
    var tests = stats[browser].tests,
    filename = "tests/results/" + browser + ".json",
    write = writeResultFile.bind(null, filename, JSON.stringify(stats[browser]));

    fs.exists(filename, function(exists) {
      if(exists) {
        fs.readFile(filename, "binary", parseResultFile.bind(null, tests, browser, write));
      } else {
        write();
      }
    });
  };

  var setColor = function(color, text) {
    return [color, "  * ", ((isNaN(text.amount)) ? "NEW" : text.amount + "%"), " ", text.test].join("");
  };

  var parseResultFile = function(tests, browser, createResultFile, err, file) {
    if (err) throw err;
    var data = JSON.parse(file),
    improved = [],
    regressed = [],
    newItems = [],
    colors = {
      red: "\x1b[1;31m",
      blue: "\x1b[1;36m",
      violet: "\x1b[0;35m",
      green: "\x1b[0;32m"
    };

    Object.keys(tests).forEach(function(test){
      var testResult = tests[test],
      dataResult = data.tests[test],
      dataObject = {
        amount: (Math.abs(testResult - dataResult) < 0.02) ? 0 : testResult - dataResult,
        test: test
      };

      if (dataObject.amount > 0) {
        improved.push(dataObject);
      } else if (dataObject.amount < 0) {
        regressed.push(dataObject);
      } else if (dataResult === undefined) {
        newItems.push(dataObject);
      }

    });

    if (newItems.length > 0 || improved.length > 0 || regressed.length > 0) {
      if (regressed.length === 0) {
        createResultFile(".baseline");
      }

      console.log(colors.violet, "********************");
      console.log((regressed.length > 0) ? colors.red : colors.green, browser);

      improved.map(setColor.bind(null, colors.green))
      .concat(regressed.map(setColor.bind(null, colors.red)))
      .concat(newItems.map(setColor.bind(null, colors.blue)))
      .forEach(function(item) {
        console.log(item);
      });
    }

  };

  function handleResults(stats) {
    Object.keys(stats).forEach(openResultFile.bind(null, stats));
  }

  function runBrowsers(pages){

    var port = 5555,
    stats = {},
    browsers = ["chrome", "firefox", "internet explorer"],
    browsersDone = 0,
    server = createServer(port),
    numPages = pages.length;

    var browserDone = function() {
      if (++browsersDone >= browsers.length) {
        server.close();
        handleResults(stats);
      }
    };

    browsers.forEach(function(browserName){
      var browser = new webdriver({
        browser: browserName
      }),
      browserType;
      browserName = browserName.replace("internet explorer", "iexplorer");
      browser.status(function(browserInfo){
        browserType = [browserName, browser.version, browserInfo.os.name.replace(/\s+/g, "-").toLowerCase()].join("-");
        var date = new Date(),
        obj = {
          tests: {},
          date: date.toISOString(),
          version: browser.version
        };
        stats[browserType] = obj;
        stats[browserName] = obj;
        processPage(0);
      });

      function processPage(index) {
        var page = pages[index++];
        testPage(browser, "http://localhost:" + port + "/" + page + "?selenium", function(result) {
          if (numPages > index) {
            processPage(index);
          } else {
            browser.close(browserDone);
          }
          stats[browserType].tests[page] = result;
        });
      }

    });
  }

  exports.tests = function() {
    getBaselineFiles().forEach(fs.unlinkSync.bind(fs));
    walkDir("tests/cases", function(err, results) {
      if (err) throw err;
      runBrowsers(results);
    });
  };

  exports.baseline = function() {
    getBaselineFiles().forEach(function(file) {
      var newName = file.substring(0, file.length - 9);
      fs.renameSync(file, newName);
      console.log(newName, "created");
    });
  };

  exports.markdown = function() {
    var data = {},
        html = "<table><thead><tr><td></td>",
        md = " | ",
        browsers = ["chrome", "firefox", "iexplorer", "safari"],
        activeBrowsers = [];

    // Create row for browsers
    browsers.forEach(function(browser) {

       if (fs.existsSync("tests/results/" + browser + ".json")) {

        var fileContents = fs.readFileSync("tests/results/" + browser + ".json");
        data[browser] = JSON.parse(fileContents);

        activeBrowsers.push(browser);
            
        html += "<th>" + browser + "<br />" + data[browser].version + "</th>";
        md += browser + data[browser].version + " | ";
      } else {
        console.log("Browser report not found. ", browser + ".json");
      }

    });

    html += "</tr></thead><tbody>\n";
    md += "\n ----";
    for (var i = activeBrowsers.length - 1; i >= 0; i--) {
      md += "|---- ";
    }
    md += "\n";

    Object.keys(data[activeBrowsers[0]].tests).forEach(function(testFile) {

      html += "<tr><td>" + testFile.substring(12) + "</td>";
      md += testFile.substring(12);
      activeBrowsers.forEach(function(activeBrowsers) {
        html += "<td>" + Math.round(data[activeBrowsers].tests[testFile] * 100) / 100 + "%</td>";
        md += " | " + Math.round(data[activeBrowsers].tests[testFile] * 100) / 100 + "%";
      });
      html += "</tr>\n";
      md += "\n";
    });

    html += "</tbody></table>";

    // if (isMarkdown){
    //   fs.writeFileSync("tests/readme.md", md);
    // } else {
      fs.writeFileSync("tests/readme.md", html);
    // }
    
  };

})();