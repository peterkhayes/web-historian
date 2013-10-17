// eventually, you'll have some code here that uses the tested helpers 
// to actually download the urls you want to download.

helpers = require('./lib/html-fetcher-helpers.js');
path = require('path');

module.exports.srcDir = path.join(__dirname, "../data/sites.txt");
module.exports.dataDir = path.join(__dirname, "../data/sites/");

helpers.readUrls(module.exports.srcDir, function (urls) {
    helpers.downloadUrls(urls, module.exports.dataDir);
});