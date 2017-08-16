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
  parentUser: { type: Schema.Types.ObjectId, ref: "User" },
  children: [
    { level: Number, user: { type: Schema.Types.ObjectId, ref: "User" } }
  ]
});

UserSchema.plugin(uniqueValidator);

// Instance Methods
UserSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.passwordHash);
};

UserSchema.methods.makeChild = function(child, level = 1) {
  return mongoose.model("User").findById(this.parentUser).then(parentUser => {
    if (parentUser) {
      parentUser.children.push({
        level: level,
        user: child
      });
      return parentUser.save();
    } else return null;
  });
};

// Virtual Properties
UserSchema.virtual("password").set(function(value) {
  this.passwordHash = bcrypt.hashSync(value, 8);
});

UserSchema.virtual("id").set(function(value) {
  return mongoose.model("User").findById(value).then(parentUser => {
    this.parentUser = parentUser;
    return this.save();
  });
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
