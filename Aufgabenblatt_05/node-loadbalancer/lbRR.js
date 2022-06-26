const express = require('express');
const request = require('request');
const servers = ['http://141.22.103.237:30020', 'http://141.22.103.237:30021'];

const profilerMiddleware = (req, res, next) => {
const start = Date.now();
// The 'finish' event comes from core Node.js, it means Node is done handing
// off the response headers and body to the underlying OS.
res.on('finish', () => {
console.log('Completed', req.method, req.url, Date.now() - start);
});
next();
};

var i = 0;
const handler = (req, res) => {
// Pipe the vanilla node HTTP request (a readable stream) into `request`
// to the next server URL. Then, since `res` implements the writable stream
// interface, you can just `pipe()` into `res`.
i++;
if (i%2 == 1)
{
	req.pipe(request({ url: servers[0] + req.url })).pipe(res);
	i=1;
}
else
{
	req.pipe(request({ url: servers[1] + req.url })).pipe(res);
	i=0;
}
}

const app = express().use(profilerMiddleware).get('*', handler).post('*', handler);
app.listen(8002);