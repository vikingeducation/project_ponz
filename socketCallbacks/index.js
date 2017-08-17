const helper = require('../helpers');

//receive events
const REGENERATE = 'regenerate';
const ADD_NODE = 'addNode';

//send events
const NEW_TREE = 'newTree';
const NEW_NODE = 'newNode';

const callbacks = client => {
	console.log('New connection!');

	client.on(REGENERATE, _regenerate);
	client.on(ADD_NODE, _addNode);

	// client.emit(NEW_TREE, _newTree);
	// client.emit(NEW_NODE, _newNode);
	client.emit('testing', 'SECRET THINGS!');
};

//user logins in and calls this
function _regenerate(data) {
	// makeTreeGraphStructure
}
function _addNode(data) {}
function _userInfo(data) {}

module.exports = callbacks;
