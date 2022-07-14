var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'wi_g002',
  password : 'MyNewPass',
  database : 'wi_g002_shipments_api',
  port: 6033
});
 
connection.connect();

connection.query('SELECT * FROM wi_g002_shipments_api.shipments where PLZ_From like "852%";', function (error, results, fields) {
  if (error) throw error;
  console.log('The solution is: ', results);
});
 
connection.end();

