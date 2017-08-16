const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const bcrypt = require("bcrypt");
const shortid = require("shortid");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  _id: {
    type: String,
    default: shortid.generate
  },
  username: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  parent: {
    type: Schema.Types.ObjectId,
    ref: "User"
  }
});

UserSchema.plugin(uniqueValidator);

UserSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.passwordHash);
};

UserSchema.virtual("password").set(function(value) {
  this.passwordHash = bcrypt.hashSync(value, 8);
});

UserSchema.virtual("id").set(function(value) {
  mongoose.model("User").findById(value).then(parent => {
    this.parent = parent;
  });
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
