const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const uniqueValidator = require("mongoose-unique-validator");
const bcrypt = require("bcrypt");

const bluebird = require("bluebird");
mongoose.Promise = bluebird;

const UserSchema = mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true
  },
  fname: { type: String },
  lname: { type: String },
  points: { type: Number },
  passwordHash: { type: String },
  parent: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  children: [
    {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  ]
});

UserSchema.plugin(uniqueValidator);

UserSchema.virtual("password").set(function(value) {
  this.passwordHash = bcrypt.hashSync(value, 8);
});

UserSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.passwordHash);
};

UserSchema.methods.populateChildren = async function(depth = 0) {
  let user = await User.findById(this._id).populate("children");
  user.depth = depth;
  user.children = await Promise.all(
    user.children.map(child => {
      return child.populateChildren(depth + 1);
    })
  );
  return user;
};

UserSchema.methods.addPointsToParents = async function() {
  let distance = 0;
  let parent = await User.findById(this.parent);
  parent.children.push(this._id);
  parent.save();
  let user = this;
  while (user.parent) {
    let parent = await User.findById(user.parent);
    if (parent) {
      parent.points += _pointsByDistance(distance);
      parent.save();
      distance++;
    }
    user = parent;
  }
};

function _pointsByDistance(distance) {
  const points = [40, 20, 10, 5, 2];
  if (distance < 5) return points[distance];
  return 1;
}

const User = mongoose.model("User", UserSchema);

module.exports = User;
