var path = require('path');
var url = require('url');
var fs = require('fs');
var httpGet = require('http-get');
var sql = require('../sql/sql.js');
module.exports.datadir = path.join(__dirname, "../data/sites.txt"); // tests will need to override this.

var headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept, X-Requested-With",
  "access-control-max-age": 10, // Seconds.
  'Content-Type': "text/html"
};

module.exports.handleRequest = function (req, res) {
  var pathname = url.parse(req.url).pathname;

  if (req.method === 'GET') {
    if (pathname === "/" || pathname === "") {
      fs.readFile(__dirname + "/public/index.html", function(err, data) {
        if (err) {
          res.writeHead(404, headers);
          res.end();
        }
        res.writeHead(200, headers);
        res.end(data);
      });
    } else {
      sql.select(pathname.slice(1, pathname.length), function(data) {
        if (!data.length) {
          console.log("Quoth the server, 404");
          res.writeHead(404, headers);
          res.end();
        } else {
          res.writeHead(200, headers);
          res.end(data[0].webpage);
        }
      });
    }
  }

  if (req.method === 'POST') {
    var postData = '';
    req.addListener('data',function(chunk){
      postData += chunk;
    });
    req.addListener('end',function(){
      var readPath = postData.slice(4); // Cut off preceding "url=".

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

