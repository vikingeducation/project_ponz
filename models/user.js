const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;
const UserSchema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    parent: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    children: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    points: Number
  },
  { timestamps: true }
);

UserSchema.plugin(uniqueValidator);

UserSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.passwordHash);
};

UserSchema.virtual('password')
  .get(function() {
    return this._password;
  })
  .set(function(value) {
    this._password = value;
    this.passwordHash = bcrypt.hashSync(value, 8);
  });

function _populateChildren(next) {
  this.populate('children');
  next();
}

UserSchema.pre('find', _populateChildren).pre('findOne', _populateChildren);

function _calculatePoints(distance) {
  const points = [20, 10, 5, 2];

  if (distance >= 4) {
    return 1;
  } else {
    return points[distance];
  }
}

UserSchema.methods.recursivelyUpdatePoints = async function() {
  let distance = 0;
  let user = this;

  while (user.parent) {
    let parent = await User.findById(user.parent);

    if (parent) {
      parent.points += _calculatePoints(distance);
      parent.save();
      distance += 1;
    }
    user = parent;
  }
};

const User = mongoose.model('User', UserSchema);

module.exports = User;
