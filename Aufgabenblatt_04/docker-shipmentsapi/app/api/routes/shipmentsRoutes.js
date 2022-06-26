module.exports = function(app) {
var shipments = require('../controllers/shipmentsController.js');
// shipments Routes
app.route('/shipments')
.get(shipments.list_all_shipments)
.post(shipments.create_a_shipment);
app.route('/shipments/:shipmentId')
.get(shipments.read_a_shipment)
.put(shipments.update_a_shipment)
.delete(shipments.delete_a_shipment);
};