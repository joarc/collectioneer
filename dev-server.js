const express = require("express");
const bodyParser = require("body-parser");
const util = require('util');
const app = express();

// ----
// CONFIG
// ----

var reportedData = {};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res) => {
  console.log(req.hostname + '|' + req.ip + '|');
  res.send("<pre>" + util.inspect(reportedData, {depth: 5}) + "</pre>");
});

app.post('/report', (req, res) => {
  reportedData[req.hostname] = req.body;
  console.log(req.hostname, 'just reported');
});

app.listen(8080, () => {
  console.log("Collectioneer receiver part is running. (On port 8080)", new Date());
});
