var express = require('express'),
app = express(),
port = process.env.PORT || 3000,
cport = process.env.CPORT || 3002,
mongoose = require('mongoose'),
Shipment = require('./api/models/shipmentsModel'), //created model loading here
bodyParser = require('body-parser');

var server1='http://141.22.103.237';
// mongoose instance connection url connection
mongoose.Promise = global.Promise;

// mongoose.set('useNewUrlParser', true);
// mongoose.set('useFindAndModify', false);
// mongoose.set('useCreateIndex', true);
// mongoose.set('useUnifiedTopology', true);

//change server hostname and database
mongoose.connect('mongodb://wi_g002_mongodb:27017/shipments_wi_g002');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
var routes = require('./api/routes/shipmentsRoutes'); //importing route
routes(app); //register the route
app.listen(port);
console.log('shipment RESTful API server started on: ' + cport);

