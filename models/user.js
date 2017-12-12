const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
const uniqueValidator = require("mongoose-unique-validator");

const UserSchema = new Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },

  referralCode: { type: String, required: true },
  points: { type: Number, required: true, default: 0 },
  referredBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

UserSchema.plugin(uniqueValidator);

UserSchema.virtual("password")
  .set(function(value) {
    this.passwordHash = bcrypt.hashSync(value, 8);
  });

UserSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.passwordHash);
};

UserSchema.statics.findReferredUsers = function(userId) {
  return this.where('referredBy', userId);
};

const User = mongoose.models.User || mongoose.model('User', UserSchema);

module.exports = User;
