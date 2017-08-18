const helper = require('../helpers');
const mongoose = require('mongoose');
const connect = require('../mongo');
const { User } = require('../models');

//receive events
const REGENERATE = 'regenerate';
const LOAD_TREE = 'loadTree';

//send events
const NEW_TREE = 'newTree';
const NEW_NODE = 'newNode';
const DISPLAY_TREE = 'displayTree';
const UPDATE_POINTS = 'updatePoints';

const callbacks = client => {
	console.log('New connection!');

	client.on(REGENERATE, _regenerate);
	client.on(LOAD_TREE, _loadTree);

	async function _regenerate(dataObj) {
		let { userId, data } = dataObj;
		await connect();
		let user = await User.findById(userId);
		helper.init(data);
		await helper.generateTreeGraphStructure(user, client);
	}

	async function _loadTree(userId) {
		let user = await User.findRecursive({ _id: userId });
		let treeGraph = await helper.makeTreeGraphStructure(user);

		client.emit(DISPLAY_TREE, treeGraph);
	}
};

module.exports = callbacks;
