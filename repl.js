const repl = require('repl').start({})
const lodash = require('lodash')
const helpers = require('./helpers')

var mongoose = require('mongoose')
var repl = require('repl').start({})
var models = require('./models')

require('./mongo')().then(() => {
  repl.context.models = models

  Object.keys(models).forEach(modelName => {
    repl.context[modelName] = mongoose.model(modelName)
  })

  repl.context.lg = data => {
    if (Array.isArray(data)) {
      if (data.length && data[0].dataValues) {
        data = data.map(item => item.dataValues)
      }
    }
    console.log(data)
  }
})

// ----------------------------------------
// Libs
// ----------------------------------------
repl.context.lodash = lodash

// ----------------------------------------
// Helpers
// ----------------------------------------
repl.context.helpers = helpers
Object.keys(helpers).forEach(key => {
  repl.context[key] = helpers[key]
})

// ----------------------------------------
// Logging
// ----------------------------------------
repl.context.lg = console.log
