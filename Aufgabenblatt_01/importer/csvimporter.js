const fastcsv = require('fast-csv');
const fs = require('fs');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/wi_g002_shipments1M');
mongoose.Promise = global.Promise;
var stream = fs.createReadStream('shipments_1M.txt');
var Schema = mongoose.Schema;
var ShipmentSchema = new Schema({
        Date:  Date,
	PLZ_From:  Number,
	From:  String,
	PLZ_To:  Number,
	To:  String,
	Weight:  Number
});
var Shipment = mongoose.model('Shipments', ShipmentSchema);
numLines=0;

fastcsv.parseStream(stream, {headers:false, delimiter:'\t', trim:true})
    .on("data", function(data){
         addShipmentToCollection(data);
    })
    .on("end", function(){
         console.log("Parsing done");
    });
function addShipmentToCollection(data){
  var shipment = new Shipment({
          Date:new Date(data[0]),
          PLZ_From:data[1],
          PLZ_To:data[3],
          Weight:Math.round(data[5]*1000)
  });
if(++numLines % 100 == 0)
   console.log("Zeilen geschrieben: " + numLines);
shipment.save(function (err) {
    if (err) // ...
    console.log(err);
 });
} 
