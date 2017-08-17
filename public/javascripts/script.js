//send events
const REGENERATE = 'regenerate';
const ADD_NODE = 'addNode';
const userId = getCookie('userId');

//receive events
const NEW_TREE = 'newTree';
const NEW_NODE = 'newNode';

$(function() {
	const socket = io.connect('http://localhost:3000');

	// Set form listener.
	console.log('wtf');
	$('#generate-button').on('click', function(e) {
		e.preventDefault();
		let $form = $('form');

		let [min, max, depth] = [
			$('#minInput').val(),
			$('#maxInput').val(),
			$('#depthInput').val()
		];

		// Emit the event.
		socket.emit(REGENERATE, { userId: userId, data: { min, max, depth } });
	});

	// socket.emit(ADD_NODE,);

	Treant.prototype.add = function(parent, nodeDef) {
		return this.tree.addNode(parent, nodeDef);
	};
});

function getCookie(name) {
	var value = '; ' + document.cookie;
	var parts = value.split('; ' + name + '=');
	if (parts.length == 2) return parts.pop().split(';').shift();
}
