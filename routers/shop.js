const express = require('express')
const app = express()
const router = express.Router()
const { User, Order, OrderItem, Product } = require('./../models')
const mongoose = require('mongoose')
const passport = require('passport')

router.get('/shop', (req, res) => {
  res.render('/shop')
})

module.exports = router
