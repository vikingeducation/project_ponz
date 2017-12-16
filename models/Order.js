const mongoose = require('mongoose')
const Schema = mongoose.Schema

const OrderSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    orderItems: [
      {
        type: Schema.Types.ObjectId,
        ref: 'OrderItem'
      }
    ],
    cost: Number
  },
  {
    timestamps: true
  }
)

const Order = mongoose.model('Order', OrderSchema)

module.exports = Order
