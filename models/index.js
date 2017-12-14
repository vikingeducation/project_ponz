let mongoose = require('mongoose');
let bluebird = require('bluebird');

mongoose.Promise = bluebird;

let models = {};

models.User = require('./User');
models.Cereal = require('./Cereal');

module.exports = models;
