'use strict';
module.exports = function(app) {
var shipment = require('../controllers/shipmentsController');
// shipment Routes
app.route('/shipments')
.get(shipment.list_all_shipments)
.post(shipment.create_a_shipment);

app.route('/shipments/:shipmentId')
.get(shipment.read_a_shipment)
.put(shipment.update_a_shipment)
.delete(shipment.delete_a_shipment);
};