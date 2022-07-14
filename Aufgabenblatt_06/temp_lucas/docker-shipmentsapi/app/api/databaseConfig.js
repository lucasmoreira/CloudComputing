var mysql = require('mysql');

config = {
  host     :  process.env.ADRDB || '141.22.103.237',
  user     : 'wi_g002',
  password : 'MyNewPass',
  database : 'wi_g002_shipments_api',
  port: process.env.DBPORT || 6033
}
var connection =mysql.createConnection(config); //added the line
connection.connect(function(err){
  if (err){
    console.log('error connecting:' + err.stack);
  }
  console.log('connected successfully to DB.');
});

module.exports ={
     connection : mysql.createConnection(config) 
}
