var mongoose = require('mongoose')
var models = require('./../models')
const { User, Product, Order, OrderItem } = models
const env = process.env.NODE_ENV || 'development'
const config = require('./../config/mongo')[env]
const mongooseeder = require('mongooseeder')
const faker = require('faker')

const mongodbUrl =
  process.env.NODE_ENV === 'production'
    ? process.env[config.use_env_variable]
    : `mongodb://${config.host}/${config.database}`

mongooseeder.seed({
  mongodbUrl: mongodbUrl,
  models: models,
  clean: true,
  mongoose: mongoose,
  seeds: () => {
    let products = []
    for (let i = 0; i < 25; i++) {
      let product = new Product({
        name: faker.commerce.productName(),
        price: `${i}`,
        sku: faker.random.number(),
        description: 'lorem ipsum',
        quantity: 50
      })
      products.push(Product.create(product))
    }

    return Promise.all(products)
  }
})
