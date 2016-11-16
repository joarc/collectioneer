const express = require("express");
const request = require("request");
const os = require("os");
const app = express();

// ----
// CONFIG
// delay:  how often it should collect data
// reportToMaster: should it report data to master
// masterAddress: domain name of master
const delay  = 1;
const reportToMaster = true;
const masterAddress = "http://localhost:8080/report";
// ----

var collectedData = {};

app.get('/', (req, res) => {
  console.log(req.hostname + '|' + req.ip + '|' + 'Requested information');
  res.json(collectedData);
});

function collectData() {
  collectedData = {
    os: {
      hostname: os.hostname(),
      arch: os.arch(),
      platform: os.platform(),
      release: os.release(),
      type: os.type(),
      cpuCount: os.cpus(),
      freeMem: os.freemem(),
      totalMem: os.totalmem(),
      load: os.loadavg(),
      uptime: os.uptime(),
      nic: os.networkInterfaces()
    },
    process: {
      arch: process.arch,
      env: process.env,
      memUsage: process.memoryUsage(),
      pid: process.pid,
      platform: process.platform,
      release: process.release,
      uptime: process.uptime(),
      version: process.version,
      versions: process.versions
    }
  }

  // Should it report to master
  if (reportToMaster) {
    report();
  }
}

function report() {
  request.post(masterAddress, {form:collectedData}, (err, res, body) => {
    /*if (err) console.log(err);
    if (res) console.log(res);
    if (body) console.log(body);*/
  });
}

var collectDataTimer = setInterval(collectData, 1000 * 60 * delay);

app.listen(4803, () => {
  console.log("Collectioneer webserver part is running. (On port 4803)", new Date());
  collectData();
});
