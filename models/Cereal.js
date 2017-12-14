const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const Schema = mongoose.Schema;

const CerealSchema = Schema({
  name: { type: String, required: true, unique: true },
  price: { type: Number, default: 0 }
});


const Cereal = mongoose.model("Cereal", CerealSchema);

module.exports = Cereal;
