const mongoose = require('mongoose')
const bluebird = require('bluebird')

mongoose.Promise = bluebird

const models = {}

models.User = require('./User')
models.Order = require('./Order')
models.OrderItem = require('./OrderItem')
models.Product = require('./Product')

module.exports = models
