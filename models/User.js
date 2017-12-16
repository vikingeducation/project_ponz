const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
const uniqueValidator = require("mongoose-unique-validator");

const UserSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String },
  fname: { type: String },
  lname: { type: String },
  points: { type: Number },
  parent: { type: Schema.Types.ObjectId, ref: "User" },
  children: [{ type: Schema.Types.ObjectId, ref: "User" }]
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

// infinitely populate children
const populateChildren = function(next) {
  this.populate("children");
  next();
};
UserSchema.pre("find", populateChildren).pre("findOne", populateChildren);

// transverse pyramid
function pointFinder(distance) {
  const points = [40, 20, 10, 5, 2];
  var value;
  distance < 5 ? (value = points[distance]) : (value = 1);
  return value;
}

UserSchema.methods.addPoints = async function() {
  var distance = 0;
  var user = this;
  while (user.parent) {
    var parent = await User.findById(user.parent);
    if (parent) {
      parent.points += pointFinder(distance);
      parent.save();
      distance++;
    }
    user = parent;
  }
};  

const User = mongoose.model("User", UserSchema);

module.exports = User;