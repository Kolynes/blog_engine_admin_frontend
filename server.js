require("dotenv").config()
const express = require('express');
const serveStatic = require("serve-static")
var enforce = require('express-sslify');
const path = require('path');
const connectHistory = require("connect-history-api-fallback");
app = express();
app.use(connectHistory())
app.use(serveStatic(path.join(__dirname, 'dist')));
app.use(enforce.HTTPS({ trustProtoHeader: true, trustXForwardedHostHeader: true }));
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("serving at http://localhost:" + port)
});
