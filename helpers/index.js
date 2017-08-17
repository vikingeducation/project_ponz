const models = require("../models");
const User = models.User;
const faker = require("faker");
const mongodbUrl = "mongodb://localhost/project_ponz_development";

//send events
const NEW_TREE = "newTree";
const NEW_NODE = "newNode";
const UPDATE_POINTS = "updatePoints";

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

    console.log(`Using parent: ${user.username}`);
    let newObj = {
      node: {
        text: {
          name: user.username
        },
        stackChildren: true,
        HTMLid: user.id,
        HTMLclass: "panel panel-info tree-node"
      }
    };
    client.emit(NEW_TREE, newObj);

    process.stdout.write("Creating children");
    await _generateTreeGraphStructure(user, client);
    await user.save();
    console.log("Done.");

    generating = false;
  },
  makeTreeGraphStructure: function(user) {
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
        },
        animation: {
          nodeSpeed: 50,
          connectorsSpeed: 50
        }
      },
      nodeStructure: _createTreeGraphStructure(user)
    };
    return chartConfig;
  }
};
function _createTreeGraphStructure(user) {
  let newObj = {
    parent: user,
    node: {
      text: {
        name: user.username,
        title: user.points
      },
      stackChildren: true,
      HTMLid: user.id,
      HTMLclass: "panel panel-info tree-node"
    }
  };
  newObj.children = user.ponverts.map(child => {
    return _createTreeGraphStructure(child);
  });
  return newObj;
}

async function _generateTreeGraphStructure(user, client) {
  const randNum = Math.floor(Math.random() * (max - min)) + min;
  for (let a = 0; a < randNum; a++) {
    let child = await User.create({
      username: faker.internet.userName(),
      password: "foo",
      parent: user,
      ponverts: []
    });
    user.addPonvert(child);
    await user.addPoints();
    let newObj = {
      parent: user,
      node: {
        text: {
          name: child.username,
          title: "0"
        },
        stackChildren: true,
        HTMLid: child.id,
        HTMLclass: "panel panel-info tree-node"
      }
    };
    let parents = await child.getParents(true);
    client.emit(NEW_NODE, newObj);
    parents.forEach(parent => {
      let dataObj = {
        id: parent.id,
        cash: parent.cash,
        points: parent.points
      };
      if (parent.parent === undefined) {
        dataObj.root = true;
      }

      client.emit(UPDATE_POINTS, dataObj);
    });

    process.stdout.write(".");

    if (depth < maxDepth) {
      depth++;
      await _generateTreeGraphStructure(child, client);
      depth--;
      await user.save();
      user = await User.findById(user.id);
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
