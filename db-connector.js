var mysql = require('mysql');
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'tchat'
});
connection.connect((error) => {
  if (error)
    throw error;
});
module.exports = connection;