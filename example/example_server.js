const fs = require('fs');
const path = require('path');
const http = require('http');

const port = process.env.PORT || 8083;
const env = process.env.NODE_ENV || 'production';

const envData = {
  "production": {
    "__api_url__": "https://snap-api.tradepending.com",
    "__es_url__": "https://snap-api.tradepending.com/api/v4/search"
  },
  "development": {
    "__api_url__": "http://localhost.tradepending.com:8080",
    "__es_url__": "http://localhost.tradepending.com:8080/api/v4/search",
    "__dealer_url__": "http://localtoyota.com/",
    "__partner_id__": "K6a7qr4dW6Akxes2f"
  }
}[env];

if (!envData) {
  console.log("Unknown NODE_ENV " + env);
  process.exit(1);
}

if (process.env.PARTNER_ID) {
  envData['__partner_id__'] = process.env.PARTNER_ID;
}
if (process.env.DEALER_URL) {
  envData['__dealer_url__'] = process.env.DEALER_URL;
}

if (!envData['__partner_id__'] || !envData['__dealer_url__']) {
  console.log("Please set env variables DEALER_URL, PARTNER_ID");
  process.exit(1);
}

console.log("Using: ", envData);

const sendFile = (res, type, file) => {
  var data = fs.readFileSync(path.join(__dirname, file), {encoding: 'utf8'});
  Object.keys(envData).forEach((key) => {
    data = data.replace(key, envData[key]);
  });
  res.writeHead(200, {
    'Content-Type': type,
    'Content-Length': Buffer.byteLength(data)
  });
  res.end(data, 'utf8');
}


const server = http.createServer((req, res) => {
  const files = {
    "/": {path: "./example_webpack.html", type: "text/html"},
    "/global": {path: "./example_global.html", type: "text/html"},
    "/example_client.js": {path: "./example_client.js", type: "application/javascript"},
    "/example_client_webpacked.js": {path: "./example_client_webpacked.js", type: "application/javascript"},
    "/snap-typeahead.js": {path: "../dist/snap-typeahead.js", type: "application/javascript"},
    "/typeahead.js": {path: "../dist/typeahead.js", type: "application/javascript"}
  };
  var file = files[req.url];
  if (!file) {
    res.writeHead(404);
    res.end();
  } else {
    sendFile(res, file.type, file.path);
  }
});

server.listen(port, (err) => {
  if (err) {
    return console.log("Error", err);
  }
  console.log("Listening on port: " + port);
});
