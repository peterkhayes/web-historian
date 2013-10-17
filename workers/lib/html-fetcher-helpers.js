var fs = require('fs');
var httpGet = require('http-get');
var sql = require('../../sql/sql.js');

exports.readUrls = function(filePath, cb){
  fs.readFile(filePath, "utf8", function(err, data) {
    if (err) {
    } else {
      data = data.split("\n");
      cb(data.slice(0, data.length - 1)); // Cut off the last newline, which has a blank url.
    }
  });
};

exports.downloadUrls = function(urls){


  for (var i = 0; i < urls.length; i++) {
    var path = urls[i];
    httpGet.get({url: path}, function (error, result) {
      if (error) {
        console.error(error);
      } else {
        sql.update(path, result.buffer);
      }
    });
  }
};