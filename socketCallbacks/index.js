const helper = require("../helpers");
const mongoose = require("mongoose");
const connect = require("../mongo.js");
const { User } = require("../models");

//receive events
const REGENERATE = "regenerate";
const ADD_NODE = "addNode";

//send events
const NEW_TREE = "newTree";
const NEW_NODE = "newNode";

const callbacks = client => {
  console.log("New connection!");

  client.on(REGENERATE, curriedRegenerate(client));
  client.on(ADD_NODE, _addNode);

  // client.emit(NEW_TREE, _newTree);
  // client.emit(NEW_NODE, _newNode);
};

//user logins in and calls this

function curriedRegenerate(client) {
  return async function _regenerate(dataObj) {
    let { userId, data } = dataObj;
    await connect();
    let user = await User.findById(userId);
    helper.makeTreeGraphStructure(user, client);
    await mongoose.disconnect();
  };
}
function _addNode(data) {}
function _userInfo(data) {}

module.exports = callbacks;
