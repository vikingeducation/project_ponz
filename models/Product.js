const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ProductSchema = new Schema(
  {
    name: String,
    price: Number,
    sku: String,
    description: String,
    quantity: Number
  },
  {
    timestamps: true
  }
)

const Product = mongoose.model('Product', ProductSchema)

module.exports = Product
