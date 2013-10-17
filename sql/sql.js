var mysql = require('mysql');
var makeConnection = function() {
  return mysql.createConnection({
    user: 'dan',
    password: 'plantlife',
    database: 'historian'
  });
};

var select = function(url, cb) {
  var connection = makeConnection();
  connection.connect();

  connection.query("SELECT webpage FROM webhistory WHERE url = '" + url + "'", function(err, results) {
    if (err) console.log(err);
    cb(results);
  });

  connection.end();
};

var insert = function(data) {
  var connection = makeConnection();
  connection.connect();

  connection.query("INSERT INTO webhistory SET ?", data, function(err, results) {
    if (err) console.log(err);
  });

  connection.end();
};


var update = function(url, webpage) {
  var connection = makeConnection();
  connection.connect();

  connection.query("UPDATE webhistory SET webpage = ? where url = ?;", [webpage, url], function(err, results) {
    if (err) console.log(err);
  });

  connection.end();
};

module.exports.insert = insert;
module.exports.select = select;
module.exports.update = update;