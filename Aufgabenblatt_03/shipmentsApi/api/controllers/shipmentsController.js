'use strict';
var mongoose = require('mongoose'),
Shipment = mongoose.model('Shipments');
exports.list_all_shipments = function(req, res) {
//console.log('List all shipments');
Shipment.find({}, function(err, Shipment) {
if (err)
res.send(err);
res.json(Shipment);
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