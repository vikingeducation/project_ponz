const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const bcrypt = require("bcrypt");
const shortid = require("shortid");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    shortId: {
      type: String,
      default: shortid.generate
    },
    username: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    children: [{ type: Schema.Types.ObjectId, ref: "User" }]
  },
  {
    timestamps: true
  }
);

UserSchema.plugin(uniqueValidator);

// Class Methods
UserSchema.statics.registerNewUser = async function(
  username,
  password,
  elderId
) {
  try {
    let createOps = [
      this.create({ username, password }),
      this.findOne({ shortId: elderId })
    ];
    let [user, elder] = await Promise.all(createOps);
    if (elder) {
      elder.children.push(user);
      await elder.save();
    }
    return user;
  } catch (e) {
    console.error(e);
  }
};

// Instance Methods
UserSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.passwordHash);
};

UserSchema.methods.populateChildren = async function(level = 0, obj = {}) {
  try {
    let popChildren = [];
    for (let child of this.children) {
      obj[level] = obj[level] + 1 || 1;
      child = await mongoose.model("User").findById(child);
      child = await child.populateChildren(level + 1, obj);
      child.contribution = Math.floor(40 / 2 ** level) || 1;
      popChildren.push(child);
    }
    this.earnings = popChildren.reduce((acc, child) => {
      return acc + child.contribution + (child.earnings || 0);
    }, 0);
    this.children = popChildren;
    this.pyramid = obj;
    return this;
  } catch (e) {
    console.error(e);
  }
};

// Virtual Properties
UserSchema.virtual("password").set(function(value) {
  this.passwordHash = bcrypt.hashSync(value, 8);
});

UserSchema.virtual("prettyDate").get(function() {
  return new Date(this.createdAt).toLocaleDateString();
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
