const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const bcrypt = require("bcrypt");
const shortid = require("shortid");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  shortId: {
    type: String,
    default: shortid.generate
  },
  username: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  ponzPoints: {
    type: Number,
    default: 0
  },
  depth: {
    type: Number,
    default: 0
  },
  ancestors: [
    {
      level: Number,

      user: { type: Schema.Types.ObjectId, ref: "User" }
    }
  ],
  children: [{ type: Schema.Types.ObjectId, ref: "User" }]
});

UserSchema.plugin(uniqueValidator);

// Instance Methods
UserSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.passwordHash);
};

// Virtual Properties
UserSchema.virtual("password").set(function(value) {
  this.passwordHash = bcrypt.hashSync(value, 8);
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
