const socket = require("socket.io");
const app = require("express")();
const server = require("http").createServer(app);
let io = socket.listen(server);
let client;

io.on("connection", _client => {
	client = _client;
});

// constructor function - should only be called once and passed the http server
module.exports.getServer = () => server;

module.exports.getApp = () => app;

module.exports.getIO = () => io;

module.exports.getClient = () => client;
