const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const uniqueValidator = require("mongoose-unique-validator");
const bcrypt = require("bcrypt");

const UserSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  score: Number,
  passwordHash: {
    type: String,
    required: true
  },
  parent: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  children: [{
    type: Schema.Types.ObjectId,
    ref: "User"
  }]
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

const autoPopulateChildren = function(next) {
    this.populate('children');
    next();
};

// This auto-populates all children on every 'findOne/find' call to Mongo
// and avoids verbose populate calls in routes/helpers
UserSchema
  .pre('findOne', autoPopulateChildren)
  .pre('find', autoPopulateChildren);

const User = mongoose.model("User", UserSchema);

module.exports = User;