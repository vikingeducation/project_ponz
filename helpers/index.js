module.exports = {
	makeTreeGraphStructure: function(user) {
		let chartConfig = {
			chart: {
				container: '#tree',
				rootOrientation: 'WEST',
				levelSeparation: 60,
				connectors: {
					type: 'bCurve',
					style: {
						stroke: 'blue',
						'stroke-width': '2px'
					}
				},
				node: {
					collapsable: true
				}
			},
			nodeStructure: _createTreeGraphStructure(user)
		};
		return chartConfig;
	}
};
function _createTreeGraphStructure(user) {
	let newObj = {
		text: {
			name: user.username
		},
		stackChildren: true,
		HTMLclass: 'panel panel-info tree-node'
	};
	newObj.children = user.ponverts.map(child => {
		return _createTreeGraphStructure(child);
	});
	return newObj;
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
