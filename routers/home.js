var express = require("express");
var router = express.Router();
//mongoose
const mongoose = require("mongoose");
var models = require("./../models");
var User = mongoose.model("User");
var Referal = mongoose.model("Referal");

referalTraverse = function(homeRoot, point) {
  var total = 0;
  for (var i = 0; i < homeRoot.length; i++) {
    total += homeRoot[i].referals.length * point;
    if (homeRoot[i].referals.length) {
      if (point === 1) {
        point = 2;
      }
      total += referalTraverse(homeRoot[i].referals, point / 2);
    }
  }
  return total;
};

totaledReferences = function(homeRoot) {
  var total = 0;
  total += referalTraverse([homeRoot], 40);
  return total;
};

module.exports = app => {
  router.get("/", (req, res) => {
    User.findOne({ _id: res.locals.user._id }).then(userPage => {
      Referal.findOne({ username: res.locals.user.username }).then(referals => {
        var total = totaledReferences(referals);
        res.render("ponz/start", { userPage, referals, total });
      });
    });
  });

  return router;
};
