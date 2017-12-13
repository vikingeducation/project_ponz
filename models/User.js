const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const uniqueValidator = require("mongoose-unique-validator");
const Schema = mongoose.Schema;

const UserSchema = Schema({
  username: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  referrer: { type: Schema.Types.ObjectId },
  referTree: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
      name: String,
      points: Number,
      date: Date
    }
  ]
});

UserSchema.plugin(uniqueValidator);

UserSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.passwordHash);
};

UserSchema.virtual("password")
  .get(function() {
    return this._password;
  })
  .set(function(value) {
    this._password = value;
    this.passwordHash = bcrypt.hashSync(value, 8);
  });

const User = mongoose.model("User", UserSchema);

module.exports = User;
