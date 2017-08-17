const userId = getCookie('userId');

//send events
const REGENERATE = 'regenerate';
const ADD_NODE = 'addNode';

//receive events
const NEW_TREE = 'newTree';
const NEW_NODE = 'newNode';
const UPDATE_POINTS = 'updatePoints';

$(function() {
	const socket = io.connect('http://localhost:3000');
	let latestNode, treeGraph;
	socket.on(NEW_TREE, data => {
		const chartConfig = {
			chart: {
				container: '#tree',
				rootOrientation: 'WEST',
				levelSeparation: 50,
				connectors: {
					type: 'bCurve',
					style: {
						stroke: 'blue',
						'stroke-width': '2px'
					}
				},
				node: {
					collapsable: true
				},
				animation: {
					nodeSpeed: 50,
					connectorsSpeed: 50
				}
			},
			nodeStructure: data.node
		};
		treeGraph = new Treant(chartConfig, function() {}, $);
		latestNode = treeGraph.tree.nodeDB.db[0];
	});

	socket.on(NEW_NODE, async data => {
		const id = '#' + data.parent._id;
		const $parent = $(id);

		const parentNode = $parent.data('treenode');
		treeGraph.addNewNode(parentNode, data.node);
	});

	socket.on(UPDATE_POINTS, data => {
		let { id, points, cash } = data;
		if (data.root === true) {
			$(`#ponz-points`).text(points);
			$(`#ponz-cash`).text(cash);
		}
		$(`div#${id} p.node-title`).text(points);
	});

	// Set form listener.
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

	Treant.prototype.addNewNode = function(parent, nodeDef) {
		return this.tree.addNode(parent, nodeDef);
	};
});

function getCookie(name) {
	var value = '; ' + document.cookie;
	var parts = value.split('; ' + name + '=');
	if (parts.length == 2) return parts.pop().split(';').shift();
}
