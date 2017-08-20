const helper = require("../helpers");
const mongoose = require("mongoose");
const connect = require("../mongo");
const { User } = require("../models");

//receive events
const REGENERATE = "regenerate";
const ADD_NODE = "addNode";
const LOAD_TREE = "loadTree";

//send events
const NEW_TREE = "newTree";
const NEW_NODE = "newNode";
const DISPLAY_TREE = "displayTree";
const UPDATE_POINTS = "updatePoints";

const callbacks = client => {
  console.log("New connection!");

  client.on(REGENERATE, _regenerate);
  client.on(ADD_NODE, _addNode);
  client.on(LOAD_TREE, _loadTree);

  async function _regenerate(dataObj) {
    let { userId, data } = dataObj;
    await connect();
    let user = await User.findById(userId);
    helper.init(data);
    await helper.generateTreeGraphStructure(user, client);
  }

  function _addNode(data) {}
  async function _loadTree(userId) {
    let user = await User.findRecursive({ _id: userId });
    let treeGraph = await helper.makeTreeGraphStructure(user);

    client.emit(DISPLAY_TREE, treeGraph);
  }
  function _userInfo(data) {}
};

//user logins in and calls this

module.exports = callbacks;
