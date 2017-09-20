var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ItemSchema = new Schema(
  {
    name: { type: String },
    price: { type: String },
    image: { type: String }
  },
  {
    timestamps: true
  }
);

// Create the model with a defined schema
var Item = mongoose.model("Item", ItemSchema);

module.exports = Item;
