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
      var readPath = postData.slice(4); // Cut off preceding "url=".
      var writePath = __dirname + "/../data/sites/" + readPath;

      // Download the file and store it locally.
      httpGet.get(readPath, writePath, function (error, result) {
        if (error) {
          console.error(error);
        } else {
          console.log('File downloaded at: ' + result.file);
          fs.appendFile(module.exports.datadir, readPath + "\n", function(err) {
            if (err) console.log("Could not append sites.txt with url.");
          });
          // Access the file we just created (inefficiency lulz) and put it in the database.
          fs.readFile(writePath, function(err, data) {
            if (err) {
              console.log('File retrieval error, could not call sql insertion.');
            } else {
              sql.insert({url: readPath, webpage: data});
              console.log("File inserted into database:");
              console.log({url: readPath, webpage: data});
            }
          });
        }
      });

      res.writeHead(302, headers);
      res.end();
    });
  }

};

