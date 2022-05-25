var mysql = require('mysql');
var pool = mysql.createPool({
  connectTimeout  : 1000000,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs340_maomal',
  password        : '1658',
  database        : 'cs340_maomal',
  dateStrings: 'date'
});
module.exports.pool = pool;
