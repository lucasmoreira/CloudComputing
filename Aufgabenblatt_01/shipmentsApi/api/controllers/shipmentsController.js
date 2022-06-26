'use strict';
var mongoose = require('mongoose'),
shipment = mongoose.model('Shipments');
exports.list_all_shipments = function(req, res) {
shipment.find({}, function(err, shipment) {
if (err)
res.send(err);
res.json(shipment);
});
};
exports.create_a_shipment = function(req, res) {
var new_shipment = new shipment(req.body);
new_shipment.save(function(err, shipment) {
if (err)
res.send(err);
res.json(shipment);
});
};
exports.read_a_shipment = function(req, res) {
shipment.findById(req.params.shipmentId, function(err, shipment) {
if (err)
res.send(err);
res.json(shipment);
});
};
exports.update_a_shipment = function(req, res) {
shipment.findOneAndUpdate({_id: req.params.shipmentId}, req.body, {new: true}, function(err, shipment) {
if (err)
res.send(err);
res.json(shipment);
});
};
exports.delete_a_shipment = function(req, res) {
shipment.remove({
_id: req.params.shipmentId
}, function(err, shipment) {
if (err)
res.send(err);
res.json({ message: 'shipment successfully deleted' });
});
};