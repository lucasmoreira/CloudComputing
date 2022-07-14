var express = require('express'),
app = express(),
port = process.env.PORT || 60002,
mongoose = require('mongoose'),
Shipment = require("../docker-shipmentsapi/app/api/models/shipmentsModel");
Shipment = mongoose.model(Shipment);
bodyParser = require('body-parser');
mongoose.connect('mongodb://localhost:27017/shipments_wi_g002');
const db = mongoose.connection; 



db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully");
});

'use strict';
var mongoose = require('mongoose'),
//Erweiterung für <5 PLZ-Stellen
list_shipments_Plz3_From = function(req, res) {
Shipment.find({PLZ_From:{$regex: 852}}, function(err, Shipment) {
if (err)res.send(err);
res.json(Shipment);
});
};





