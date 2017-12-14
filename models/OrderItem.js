const mongoose = require('mongoose')
const Schema = mongoose.Schema

const OrderItemSchema = new Schema(
  {
    name: String,
    price: Number,
    sku: String,
    description: String,
    quantity: Number,
    order: {
      type: Schema.Types.ObjectId,
      ref: 'Order'
    }
  },
  {
    timestamps: true
  }
)

const OrderItem = mongoose.model('OrderItem', OrderItemSchema)

module.exports = OrderItem
