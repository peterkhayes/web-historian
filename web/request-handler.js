var path = require('path');
var url = require('url');
var fs = require('fs');
module.exports.datadir = path.resolve(__dirname, "../data/sites.txt"); // tests will need to override this.

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
    if (pathname === "/") {
      fs.readFile(__dirname + "/public/index.html", function(err, data) {
        if (err) {
          res.writeHead(404, headers);
          res.end();
        }
        res.writeHead(200, headers);
        res.end(data);
      });
    } else {
      fs.readFile(__dirname + "/../data/sites" + pathname, function(err, data) {
        if (err){
          res.writeHead(404, headers);
          res.end();
        }
        res.writeHead(200, headers);
        res.end(data);
      });
    }
  }
};

