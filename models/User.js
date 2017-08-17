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
    ponzPoints: {
      type: Number,
      default: 0
    },
    elder: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
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
      let promises = [];
      let level = 0;
      user.elder = elder;
      promises.push(user.save());
      elder.children.push(user);
      while (elder) {
        elder.ponzPoints += Math.floor(40 / 2 ** level++) || 1;
        promises.push(elder.save());
        elder = await this.findById(elder.elder);
      }
      await Promise.all(promises);
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

UserSchema.methods.populateChildren = async function() {
  const user = Object.assign({}, this._doc);
  try {
    let popChildren = [];
    for (let child of user.children) {
      child = await mongoose.model("User").findById(child);
      child = await child.populateChildren();
      popChildren.push(child);
    }
    user.children = popChildren;
    return user;
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
