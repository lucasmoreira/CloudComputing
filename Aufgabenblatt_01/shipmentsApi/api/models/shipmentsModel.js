'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ShipmentSchema = new Schema({
Date: {
type: Date,
Required: 'date of shipment'
},
PLZ_From: {
type: String,
Required: 'place of sender'
},
PLZ_To: {
	type: String,
	Required: 'address of receiver'
},
Weight: {
type: Number,
Required: 'Weight of delivery in grams'
}
});
module.exports = mongoose.model('Shipments', ShipmentSchema);