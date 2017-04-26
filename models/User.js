const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const UserSchema = mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true
  },
  fname: {
    type: String,
    unique: true
  },
  lname: {
    type: String,
    unique: true
  }
});
UserSchema.plugin(uniqueValidator);

const User = mongoose.model("User", UserSchema);

module.exports = User;
