const express = require("express");
const http = require("http");
const path = require("path");
const fs = require("fs");
const { server: wispServer } = require("@mercuryworkshop/wisp-js/server");

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

// serve scramjet
app.use("/scram", express.static(
  path.join(__dirname, "node_modules/@mercuryworkshop/scramjet/dist")
));

// serve baremux
app.use("/baremux", express.static(
  path.join(__dirname, "node_modules/@mercuryworkshop/bare-mux/dist")
));

// serve libcurl
app.use("/libcurl", express.static(
  path.join(__dirname, "node_modules/@mercuryworkshop/libcurl-transport/dist")
));

// serve public folder (your chudoogle.html as index.html)
app.use(express.static(path.join(__dirname)));

// wisp websocket server at /socket/
server.on("upgrade", (req, socket, head) => {
  if (req.url.startsWith("/socket/")) {
    wispServer.routeRequest(req, socket, head);
  } else {
    socket.destroy();
  }
});

server.listen(PORT, () => {
  console.log(`chudoogle running on http://localhost:${PORT}`);
});
