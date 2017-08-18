const socket = require('socket.io');
const app = require('express')();
const server = require('http').createServer(app);
let io = socket.listen(server);

function waitForConnection() {
	let c = io.on('connection', client => {
		return client;
	});

	return c;
}

const c = waitForConnection();

// client.emit('hello');

// constructor function - should only be called once and passed the http server
module.exports.getServer = () => server;

module.exports.getApp = () => app;

module.exports.getIO = () => io;

module.exports.getClient = () => c;
