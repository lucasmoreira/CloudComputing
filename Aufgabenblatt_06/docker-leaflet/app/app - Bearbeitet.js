// Initialize leaflet.js
var L = require('leaflet');

var apiHost =  'http://141.22.103.237:8002';
console.log(apiHost);
var requestlist=[];
var servers=[];
var direction ="to" //"from"


// Initialize the map
var map = L.map('map', {
  scrollWheelZoom: false
});

// Set the position and zoom level of the map 
map.setView([53.57, 10.01], 9);

/*	Variety of base layers */
var osm_mapnik = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; OSM Mapnik <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

var osm_bw_mapnik = L.tileLayer('https://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png', {
	maxZoom: 18,
	attribution: '&copy; OSM Black and White Mapnik<a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
});

var stamen_toner_bw = L.tileLayer('https://stamen-tiles.a.ssl.fastly.net/toner/{z}/{x}/{y}.png', {
	maxZoom: 18,
	attribution: '&copy; Stamen Toner Black & White<a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
});

var osm_de = L.tileLayer('https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png', {
	maxZoom: 18,
	attribution: '&copy; OSM Deutschland <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
});



// Create base layers group object
var baseLayers = {
	"OSM Mapnik": osm_mapnik,
	"OSM Black White Mapnik": osm_bw_mapnik,
	"ST Black White": stamen_toner_bw,
	"OSM Germany": osm_de,
};

//plz= all PLZ from data/plz-5stellig.geojson 
var plzData = [];
for (var i = 0; i<=9; i++) {
  var obj = {type:"FeatureCollection", features:[]};
  plzData.push(obj);
}

//split and generate features
plz.features.forEach(function(element) {
    for (var k = 0; k<=9; k++) {
      //console.log(element.properties.plz);
      var n = k.toString();
      if(element.properties.plz.startsWith(n)) {
        plzData[k].features.push(element);

        break;
      }
    }
});

//generate Layer
var plzGeoJsonLayer = [];
for (var i = 0; i<=9; i++) {
	plzGeoJsonLayer[i] = L.geoJson(plzData[i], {
	style: style,
	onEachFeature: onEachFeature});
}
	

//activate on layer 2 on start
plzGeoJsonLayer[2].addTo(map);

//add to controls
var overLayers = {
	"PLZ 0": plzGeoJsonLayer[0],
  "PLZ 1": plzGeoJsonLayer[1],
  "PLZ 2": plzGeoJsonLayer[2],
  "PLZ 3": plzGeoJsonLayer[3],
  "PLZ 4": plzGeoJsonLayer[4],
  "PLZ 5": plzGeoJsonLayer[5],
  "PLZ 6": plzGeoJsonLayer[6],
  "PLZ 7": plzGeoJsonLayer[7],
  "PLZ 8": plzGeoJsonLayer[8],
  "PLZ 9": plzGeoJsonLayer[9]
}

L.control.layers(baseLayers, overLayers).addTo(map);

// Create control that shows information on hover
var info = new L.control({position:'topright'});

info.onAdd = function (map) {
	this._div = L.DomUtil.create('div', 'info');
	this.update();
	return this._div;
};

info.update = function (props, weight, number) {
		this._div.innerHTML = '<p><b>Zip </b></p>' +  (props ?
			'<b>' + props.plz + '</b><br /> Total weight of all shippments ' + direction + ' this area: ' + weight + ' kg<br/>'
			+ 'Total number of all shipments ' + direction +' this area: ' + number
			: 'Hover over a district');};
info.addTo(map);

// Create control that shows additional api information on hover
var info2 = L.control({position:'bottomleft'});

info2.onAdd = function (map) {
	this._div = L.DomUtil.create('div', 'info');
	this.update();
	return this._div;
};
info2.update = function (props, apiinfo, currentrequest, servers) {
		this._div.innerHTML = (props ? '<p><b>Current request: </b></p>' + currentrequest + '<br/><br/>' 
			+ '<p><b>Total number of api requests per Container </b></p>' + apiinfo
			: '<p><b>API Information </b></p>' + 'Hover over a district');};

info.addTo(map); 
info2.addTo(map); 


/* Set of function for the hover over the geojson layer */
function style(feature) {

	return {
		weight: 2,
		opacity: 0.7,
		color: 'grey',
		dashArray: '2',
		fillOpacity: 0.0,
	};
}

function highlightFeature(e) {
	var layer = e.target;
	console.log(layer);

	layer.setStyle({
		weight: 5,
		color: '#277FCA',
		dashArray: '',
		fillOpacity: 0.7
	});

	if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
		layer.bringToFront();
	}
	loadData(e);

}

var geojson;

function resetHighlight(e) {

  for(var propertyName in overLayers) {
    overLayers[propertyName].resetStyle(e.target);

  }
	info.update();
	info2.update();
}

var popup = L.popup();
function zoomToFeature(e) {
	popup.setContent("You clicked the map at " )
}

function onEachFeature(feature, layer) {
	layer.on({
		mouseover: highlightFeature,
		mouseout: resetHighlight,
		click: zoomToFeature
	});
}

function loadData(e) {
    $.ajax({
        url: apiHost+"/shipments/plz"+direction+"/"+e.target.feature.properties.plz,
        dataType: 'json',
        crossDomain:true,
        context: e,
        type: 'GET',
        success: function(data) {
		let popped = data.pop();
          info.update(e.target.feature.properties, aggregateData(data), PackageNo(data));
	  info2.update(e.target.feature.properties, aggregateRequest(popped), popped, servers);
        },
        error: function(data){'ERROR: ' + console.log(data)}
    });
}



function aggregateData(data) {
  var sumWeight=0;
  data.forEach(item=> sumWeight+=item.Weight );
  return parseFloat(sumWeight).toPrecision(5);
}

function aggregateRequest(popped) {
  let text = "";
  var requestcount=[];
  ip=popped.slice(1,22)+':'+popped.slice(popped.length-5,popped.length-1);
  requestlist.push(ip);	
  console.log(requestlist);	
  servers = [...new Set(requestlist)];
  console.log(servers);
  for (let k = 0; k <= servers.length; k++) {
    requestcount[k]=0;
    requestlist.forEach(element => {
     if (element === servers[k]) {
     requestcount[k] += 1;} 
     });}
  console.log(requestcount);
  //Erstellen der Textausgabe
  for (let i = 1; i <= servers.length; i++) {
  text += 'Container' + i + ' ' + servers[i-1].slice(0,21) + ' Port ' + servers[i-1].slice(22,servers[i-1].length)+ ': ' + requestcount[i-1] + "<br>";}
  return text;
}

function PackageNo(data) {
  var ShipmentId=[];
  data.forEach(item=> ShipmentId.push(item.ShipmentId) );
  return ShipmentId.length;
}

function ShipID(data) {
  let text = "";
  var ShipmentId=[];
  data.forEach(item=> ShipmentId.push(item.ShipmentId) );
  var stopreq = ShipmentId.length/5;
  stopreq = Math.min(stopreq,5);
  for (let i = 0; i < stopreq ; i++) {
  text += ShipmentId.splice(ShipmentId.length-5, ShipmentId.length) + "<br>";
}
  return text;
}

function topPLZ(data) {
  let text = "";
  var topplz=[];
  var allplz=[];
  if (direction === "from"){
  data.forEach(item=> allplz.push(item.PLZ_To) );
  topplz = [...new Set(allplz)];
  topplz = topplz.slice(0, 5);
  text = '<p><b>Top 5 Shipment Destination PLZ </b></p>' + topplz;}
  else{
  data.forEach(item=> allplz.push(item.PLZ_From) );
  topplz = [...new Set(allplz)];
  topplz = topplz.slice(0, 5);
  text = '<p><b>Top 5 Shipment Origin PLZ </b></p>' + topplz;}
  return text;
}

