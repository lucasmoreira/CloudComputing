var express = require('express'),
app = express(),
port = 3002,
mongoose = require('mongoose'),
Task = require('./api/models/shipmentsModel'), //created model loading here
bodyParser = require('body-parser');
// mongoose instance connection url connection
mongoose.Promise = global.Promise;
// mongoose.set('useNewUrlParser', true);
// mongoose.set('useFindAndModify', false);
// mongoose.set('useCreateIndex', true);
//mongoose.set('useUnifiedTopology', true);
mongoose.connect('mongodb://localhost:27017/wi_g002_shipments_a3');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
var routes = require('./api/routes/shipmentsRoutes'); //importing route
routes(app); //register the route
app.listen(port);
console.log('shipment RESTful API server started on: ' + port);
