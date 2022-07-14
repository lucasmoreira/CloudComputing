'use strict';
var mongoose = require('mongoose'),
Shipment = mongoose.model('Shipments');

exports.list_all_shipments = function(req, res) {
var pageNo = parseInt(req.query.pageNo);
var size = parseInt(req.query.size);
const options = {
page: pageNo,
limit: size,
collation: {
locale: 'de'
}
};
if(pageNo <= 0) {
var response = {"error" : true,"message" : "invalid page number, should start with 1"};
return res.json(response);
}
else if(size <= 0) {
var response = {"error" : true,"message" : "invalid size number, should be at least 1"};
return res.json(response);
}
Shipment.paginate({}, options, function(err, result) {
return res.json(result.docs);
});
};
exports.create_a_shipment = function(req, res) {
var new_Shipment = new Shipment(req.body);
new_Shipment.save(function(err, Shipment) {
if (err)
res.send(err);
res.json(Shipment);
});
};
exports.read_a_shipment = function(req, res) {
Shipment.findOne({ShipmentId:req.params.shipmentId}, function(err, Shipment) {
if (err)
res.send(err);
res.json(Shipment);
});
};

exports.list_shipments_Plz_To = function(req, res) {
//Hier ihren Code einfügen
Shipment.find({PLZ_To:req.params.plz}, function(err, Shipment) {
if (err)
res.send(err);
res.json(Shipment);
});
};

//Erweiterung für <5 PLZ-Stellen
exports.list_shipments_Plz3_To = function(req, res) {
var regEx = new RegExp('^' +req.params.plz, 'i');
const start = Date.now();
Shipment.find({PLZ_To:{$regex: regEx}}, function(err, Shipment) {
if (err)res.send(err);
/*
console.log('Completed on ', 'originalHost' , req.method, req.url, Date.now() -start);
 var requestinfo = [
	{Date: start,
	 Last_Update: Date.now,
	 Methode: req.method,
	 URL: req.url,
	 Host: 'originalHost',
	 _id: "999999999999999999999999"}
  ];
var infoJSON = JSON.stringify(requestinfo);
Shipment = Shipment + infoJSON;
*/
console.log(req.url);
res.json(Shipment);
});
};

exports.list_shipments_Plz_From = function(req, res) {
//Hier ihren Code einfügen
Shipment.find({PLZ_From:req.params.plz}, function(err, Shipment) {
if (err)
res.send(err);
res.json(Shipment);
});
};

//Erweiterung für <5 PLZ-Stellen
exports.list_shipments_Plz3_From = function(req, res) {
var regEx = new RegExp('^' +req.params.plz, 'i');
Shipment.find({PLZ_From:{$regex: regEx}}, function(err, Shipment) {
if (err)res.send(err);
res.json(Shipment);
});
};


exports.update_a_shipment= function(req, res) {
Shipment.findOneAndUpdate({ShipmentId:req.params.shipmentId}, req.body, {new: true}, function(err, Shipment) {
if (err)
res.send(err);
res.json(Shipment);
});
};
// Shipment.remove({}).exec(function(){});
exports.delete_a_shipment = function(req, res) {
Shipment.remove({
ShipmentId: req.params.shipmentId
}, function(err, Shipment) {
if (err)
res.send(err);
res.json({ message: 'Shipment successfully deleted' });
});
};