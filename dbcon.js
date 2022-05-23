var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs340_maomal',
  password        : '1658',
  database        : 'cs340_maomal'
});
module.exports.pool = pool;
