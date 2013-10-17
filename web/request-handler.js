var path = require('path');
var url = require('url');
var fs = require('fs');
var httpGet = require('http-get');
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
        } else if (!data) {
          res.writeHead(404, headers);
          res.end();
        } else {
          res.writeHead(200, headers);
          res.end(data);
        }
      });
    }
  } else if (req.method === 'POST') {
    var postData = '';
    req.addListener('data',function(chunk){
      postData += chunk;
      console.log('******Recieved POST data chunk "'+chunk+ '".');
    });
    req.addListener('end',function(){
      postData = postData.slice(4); // Cut off preceding "url=".
      //return "<html><head></head><body><script>alert('Youve been hacked!');</script></body></html>";
      httpGet.get(postData, __dirname + "/../data/sites/" + postData, function (error, result) {
      if (error) {
        console.error(error);
      } else {
        fs.appendFile(module.exports.datadir, postData + "\n", function(err) {
          if (err) throw err;
        });
        console.log('File downloaded at: ' + result.file);
      }
      });
      res.writeHead(302, headers);
      res.end();
    });
  }

};

