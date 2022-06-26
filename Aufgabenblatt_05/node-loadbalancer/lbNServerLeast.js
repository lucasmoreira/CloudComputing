const express = require('express');
const request = require('request');

var nServer = 10;
const portPrefix = 10200;
const url = 'http://localhost';

var servers = [];
var activeCons = [];

for (var i = 0; i < nServer; i++) {
  let port = portPrefix + i;
  let server = url + ':' + port;
  servers.push(server);
 activeCons.push(0);
}
const profilerMiddleware = (req, res, next) => {
  const start = Date.now();
  // The 'finish' event comes from core Node.js, it means Node is done handing
  // off the response headers and body to the underlying OS.
  res.on('finish', () => {
//get host
      const originalHost = 'http://'+req._readableState.pipes.originalHost;
      //increase active connections
      activeCons[servers.indexOf(originalHost)]--;
    console.log('Completed on ', originalHost,  req.method, req.url, Date.now() - start);
  });
next ();
};

const handler = (req, res) => {
  //get index of lowest activeCons
  let serverI = activeCons.indexOf(Math.min(...activeCons));
  // Pipe the vanilla node HTTP request (a readable stream) into `request`
  // to the next server URL. Then, since `res` implements the writable stream
  // interface, you can just `pipe()` into `res`.
  req.pipe(request({ url: servers[serverI] + req.url })).pipe(res);
activeCons[serverI]++;
};

const app = express().use(profilerMiddleware).get('*', handler).post('*', handler);
app.listen(8002);
