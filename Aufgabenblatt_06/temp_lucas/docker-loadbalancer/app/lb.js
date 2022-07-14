const express = require('express');
const request = require('request');
console.log(process.env.SERVERS)
const servers = process.env.SERVERS.split(" ");

var fs = require('fs');

process.on('uncaughtException', function (err) {
    console.log(err);
});

const profilerMiddlewareRR = (req, res, next) => {
//allow CORS
	res.header("Access-Control-Allow-Origin","*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
const start = Date.now();
// The 'finish' event comes from core Node.js, it means Node is done handing
// off the response headers and body to the underlying OS.
res.on('finish', () => {
const originalHost = 'http://'+req._readableState.pipes.originalHost;
console.log('Completed on ', originalHost , req.method, req.url, Date.now() -start);
//res.send('Host: ' + originalHost + 'Method: ' + req.method + 'URL: ' + req.url);
});
next();
};
const profilerMiddlewareLeast = (req, res, next) => {
const start = Date.now();
//allow CORS
	res.header("Access-Control-Allow-Origin","*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
// The 'finish' event comes from core Node.js, it means Node is done handing
// off the response headers and body to the underlying OS.
res.on('finish', () => {
//get host
const originalHost = 'http://'+req._readableState.pipes.originalHost;
//decrease active connections
activeCons[servers.indexOf(originalHost)]--;
console.log('Completed on ', originalHost , req.method, req.url, Date.now() - start);
});
next();
};
var activeCons = [];

for (var i = 0; i < servers.length; i++) {
activeCons.push(0);
}
const handlerLeast = (req, res) => {
//get index of lowest activeCons
let serverI = activeCons.indexOf(Math.min(...activeCons));
// Pipe the vanilla node HTTP request (a readable stream) into `request`
// to the next server URL. Then, since `res` implements the writable stream
// interface, you can just `pipe()` into `res`.
req.pipe(request({ url: servers[serverI] + req.url })).pipe(res);
activeCons[serverI]++;
};
let cur = 0;
const handlerRR = (req, res) => {
// Pipe the vanilla node HTTP request (a readable stream) into `request`
// to the next server URL. Then, since `res` implements the writable stream
// interface, you can just `pipe()` into `res`.
console.log( servers[cur] + req.url )
req.pipe(request({ url: servers[cur] + req.url })).pipe(res);
cur = (cur + 1) % servers.length;
console.log("new cur: " + cur);
};
var app;
if(process.env.LB_STRATEGY ==='RR') {
app = express().use(profilerMiddlewareRR).get('*', handlerRR).post('*', handlerRR);
}
else if(process.env.LB_STRATEGY ==='LEAST') {
app = express().use(profilerMiddlewareLeast).get('*', handlerLeast).post('*', handlerLeast);
}
else {
console.log('ERROR no lb strategy defined');
}
app.listen(8080);
