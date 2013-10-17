var fs = require('fs');
var httpGet = require('http-get');

exports.readUrls = function(filePath, cb){
  fs.readFile(filePath, "utf8", function(err, data) {
    if (err) throw err;
    cb(data.split("\n"));
  });
};

exports.downloadUrls = function(urls, dir){
  for (var i = 0; i < urls.length; i++) {
    var url = urls[i];
    httpGet.get(url, dir + url, function (error, result) {
      if (error) {
        console.error(error);
      } else {
        console.log('File downloaded at: ' + result.file);
      }
    });
  }
};
