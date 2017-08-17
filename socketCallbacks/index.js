const helper = require('../helpers');
const mongoose = require('mongoose');
const connect = require('../mongo');
const { User } = require('../models');

//receive events
const REGENERATE = 'regenerate';
const ADD_NODE = 'addNode';
const GET_POINTS = 'getPoints';

//send events
const NEW_TREE = 'newTree';
const NEW_NODE = 'newNode';
const UPDATE_POINTS = 'updatePoints';

const callbacks = client => {
	console.log('New connection!');

	client.on(REGENERATE, _regenerate);
	client.on(ADD_NODE, _addNode);
	client.on(GET_POINTS, _getPoints);

	// client.emit(NEW_TREE, _newTree);
	// client.emit(NEW_NODE, _newNode);
	//

	async function _regenerate(dataObj) {
		let { userId, data } = dataObj;
		await connect();
		let user = await User.findById(userId);
		helper.init(data);
		await helper.generateTreeGraphStructure(user, client);
	}

	function _addNode(data) {}
	function _userInfo(data) {}

	async function _getPoints(id) {
		let user = await User.findById(id);
		await client.emit(UPDATE_POINTS, { points: user.points, cash: user.cash });
	}
};

//user logins in and calls this

module.exports = callbacks;
