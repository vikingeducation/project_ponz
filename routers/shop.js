const express = require('express')
const app = express()
const router = express.Router()
const { User, Order, OrderItem, Product } = require('./../models')
const mongoose = require('mongoose')
const passport = require('passport')

router.get('/', async (req, res) => {
  let productArr = await Product.find({})
  res.render('shop', { products: productArr })
})

module.exports = router
