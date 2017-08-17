//send events
const REGENERATE = "regenerate";
const ADD_NODE = "addNode";
const userId = getCookie("userId");

//receive events
const NEW_TREE = "newTree";
const NEW_NODE = "newNode";

$(function() {
  var socket = io.connect("http://localhost:3000");
  // socket.emit(ADD_NODE,);

  Treant.prototype.add = function(parent, nodeDef) {
    return this.tree.addNode(parent, nodeDef);
  };
});

function getCookie(name) {
  var value = "; " + document.cookie;
  var parts = value.split("; " + name + "=");
  if (parts.length == 2) return parts.pop().split(";").shift();
}
