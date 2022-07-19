var mqtt=require('mqtt');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

var mqttOptions={
clientId:'mqttToHTTP_'+Math.random().toFixed(36).substring(2, 38),
clean:true};
var client = mqtt.connect('mqtt://141.22.102.163', mqttOptions);

client.on('connect', function () {
  console.log('connected');
  client.subscribe('cloud_datastream/0'); // Topic eintragen
});

client.on('message', function (receivedOnTopic, message) {
  console.log(message.toString());
  
  var shipmentObj = JSON.parse(message.toString());
  //here we need to implement an if-Function whether its a new shipment or and update
 if (shipmentObj.Status == 0) {
  console.log('Status == 0');
  var xhr = new XMLHttpRequest();
  xhr.withCredentials = true;
  xhr.open("POST",'http://localhost:3002/shipments'); //TODO: Port Ihrer Gruppe einfügen!
  xhr.setRequestHeader("Content-Type", "application/json");

  xhr.send(JSON.stringify(shipmentObj));
}
else{updateShipmentRequest(shipmentObj)}
});

function updateShipmentRequest(data) {
  var xhr = new XMLHttpRequest();
  xhr.withCredentials = true;
  console.log('Status != 0');
  //xhr.onreadystatechange = function() {
  //    if (xhr.readyState == XMLHttpRequest.DONE) {
  //		console.log(xhr.responseText);
  //
  //    }
  //}
  xhr.open("PUT", "http://localhost:3002/shipments/"+ data.ShipmentId);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send(JSON.stringify(data));
}
