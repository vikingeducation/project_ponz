const mongoose = require("mongoose");
var bluebird = require("bluebird");
mongoose.Promise = bluebird;
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
const uniqueValidator = require("mongoose-unique-validator");

const UserSchema = new Schema(
  {
    username: { type: String, unique: true, required: true },
    passwordHash: { type: String, require: true },
    referrerId: Number,
    referrals: Array,
    AnkhMorporkDollars: Number
  },
  {
    timestamps: true
  }
);

UserSchema.plugin(uniqueValidator);

UserSchema.virtual("password").set(function(value) {
  this.passwordHash = bcrypt.hashSync(value, 2);
});

UserSchema.methods.validatePassword = function(password) {
  return bcrypt.compareSync(password, this.passwordHash);
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
