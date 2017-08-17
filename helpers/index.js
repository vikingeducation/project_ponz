const models = require('../models');
const User = models.User;
const faker = require('faker');
const mongodbUrl = 'mongodb://localhost/project_ponz_development';

//send events
const NEW_TREE = 'newTree';
const NEW_NODE = 'newNode';

let depth = 0,
	generating = false,
	min = 3,
	max = 3,
	maxDepth = 3;
module.exports = {
	init: data => {
		min = +data.min;
		max = +data.max;
		maxDepth = +data.depth - 1;
	},
	generateTreeGraphStructure: async function(user, client) {
		depth = 0;
		console.log(`Generating status: ${generating}`);
		if (generating) return false;
		generating = true;

		process.stdout.write(`Using parent: user.username`);
		let newObj = {
			node: {
				text: {
					name: user.username
				},
				stackChildren: true,
				HTMLid: user.id,
				HTMLclass: 'panel panel-info tree-node'
			}
		};
		client.emit(NEW_TREE, newObj);
		console.log('Done.');

		process.stdout.write('Creating children');
		await _generateTreeGraphStructure(user, client);
		await user.save();
		console.log('Done.');

		generating = false;
	}
	// makeTreeGraphStructure: function(user) {
	// 	let chartConfig = {
	// 		chart: {
	// 			container: '#tree',
	// 			rootOrientation: 'WEST',
	// 			levelSeparation: 50,
	// 			connectors: {
	// 				type: 'bCurve',
	// 				style: {
	// 					stroke: 'blue',
	// 					'stroke-width': '2px'
	// 				}
	// 			},
	// 			node: {
	// 				collapsable: true
	// 			}
	// 		},
	// 		nodeStructure: _createTreeGraphStructure(user)
	// 	};
	// 	return chartConfig;
	// }
};
// function _createTreeGraphStructure(user) {
// 	let newObj = {
// 		text: {
// 			name: user.username
// 		},
// 		stackChildren: true,
// 		HTMLclass: 'panel panel-info tree-node'
// 	};
// 	newObj.children = user.ponverts.map(child => {
// 		return _createTreeGraphStructure(child);
// 	});
// 	return newObj;
// }

async function _generateTreeGraphStructure(user, client) {
	const randNum = Math.floor(Math.random() * (max - min)) + min;
	for (let a = 0; a < randNum; a++) {
		let child = await User.create({
			username: faker.internet.userName(),
			password: 'foo',
			parent: user,
			ponverts: []
		});
		await user.addPonvert(child);
		await user.addPoints();

		let newObj = {
			parent: user,
			node: {
				text: {
					name: child.username
				},
				stackChildren: true,
				HTMLid: child.id,
				HTMLclass: 'panel panel-info tree-node'
			}
		};
		client.emit(NEW_NODE, newObj);

		process.stdout.write('.');

		if (depth < maxDepth) {
			depth++;
			await _generateTreeGraphStructure(child, client);
			depth--;
		}
	}
}
/*
simple_chart_config = {
    chart: {
        container: "#tree-simple"

    },

    nodeStructure: {
        text: { name: "Parent node" },
        children: [
            {
                text: { name: "First child" }
            },
            {
                text: { name: "Second child" }
            }
        ]
    }
};

*/
