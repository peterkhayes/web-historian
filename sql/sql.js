var mysql = require('mysql');
var makeConnection = function() {
  return mysql.createConnection({
    user: 'dan',
    password: 'plantlife',
    database: 'historian'
  });
};

var select = function(cb) {

  var connection = makeConnection();

  connection.connect();

  connection.query("SELECT * FROM webhistory", function(err, results) {
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

module.exports.insert = insert;
module.exports.select = select;