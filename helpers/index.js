//send events
const NEW_TREE = "newTree";
const NEW_NODE = "newNode";

module.exports = {
  makeTreeGraphStructure: function(user, client) {
    let chartConfig = {
      chart: {
        container: "#tree",
        rootOrientation: "WEST",
        levelSeparation: 50,
        connectors: {
          type: "bCurve",
          style: {
            stroke: "blue",
            "stroke-width": "2px"
          }
        },
        node: {
          collapsable: true
        }
      },
      nodeStructure: _createTreeGraphStructure(user, client)
    };
    return chartConfig;
  }
};
function _createTreeGraphStructure(user, client) {
  let newObj = {
    text: {
      name: user.username
    },
    stackChildren: true,
    HTMLclass: "panel panel-info tree-node"
  };
  client.emit(NEW_NODE, newObj);
  console.log("user ", user);
  console.log("user ", user.ponverts);
  newObj.children = user.ponverts.map(child => {
    return _createTreeGraphStructure(child, client);
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
