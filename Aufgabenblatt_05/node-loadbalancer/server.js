const body = require('body-parser');
const express = require('express');
const app1 = express();
const app2 = express();
// Parse the request body as JSON
app1.use(body.json());
app2.use(body.json());
const handler = serverNum => (req, res) => {
console.log(`server ${serverNum}`, req.method, req.url, req.body);
res.send(`Hello from server ${serverNum}\n`);
};
// Only handle GET and POST requests
app1.get('*', handler(0)).post('*', handler(0));
app2.get('*', handler(1)).post('*', handler(1));
app1.listen(30020);
app2.listen(30021);