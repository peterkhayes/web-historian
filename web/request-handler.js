var path = require('path');
var url = require('url');
var query = require('querystring');
var fs = require('fs');
var httpGet = require('http-get');
var sql = require('../sql/sql.js');
module.exports.datadir = path.join(__dirname, "../data/sites.txt"); // tests will need to override this.

var framedir = path.join(__dirname, "frame.html");

var headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept, X-Requested-With",
  "access-control-max-age": 10, // Seconds.
  'Content-Type': "text/html"
};

module.exports.handleRequest = function (req, res) {
  var pathname = url.parse(req.url).pathname;
  var query = url.parse(req.url, true).query;
  console.log('get request for ' + pathname);

  if (req.method === 'GET') {
    if (query.getList) {
      fs.readFile(module.exports.datadir, "utf8", function(err, data) {
        if (err) {
        } else {
          data = data.split("\n");
          res.writeHead(200, headers);
          res.end(JSON.stringify(data.slice(0, data.length - 1))); // Cut off the last newline, which is a blank
        }
      });
    } else {
      if (pathname === "/" || pathname === "") {
        fs.readFile(__dirname + "/public/index.html", function(err, data) {
          if (err) console.log("Homepage not found.");
          res.writeHead(200, headers);
          res.end(data);
        });
      } else {
        sql.select(pathname.slice(1, pathname.length), function(data) {
          console.log(data);
          if (!data.length) {
            res.writeHead(404, headers);
            res.end();
          } else {
            res.writeHead(200, headers);
            res.end(data[0].webpage);
          }
        });
      }
    }
  }

  if (req.method === 'POST') {
    var readPath = '';
    req.addListener('data',function(chunk){
      readPath += chunk;
    });
    req.addListener('end',function(){

      // Download the file and store it locally.
      httpGet.get({url: readPath}, function (error, result) {
        if (error) {
          console.error(error);
        } else {
          fs.appendFile(module.exports.datadir, readPath + "\n", function(err, result) {
            if (err) console.log(err);
          });
          sql.insert({url: readPath, webpage: result.buffer});
        }
      });

      res.writeHead(302, headers);
      res.end();
    });
  }
};

