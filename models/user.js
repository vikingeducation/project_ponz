const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      // NOT USED
      type: String,
      required: true
    },
    passwordHash: String,
    parent: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    ponverts: [
      {
        type: Schema.Types.ObjectId,
        ref: "User"
      }
    ],
    points: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

User.virtual("password")
  .set(function(password) {
    this.passwordHash = bcrypt.hashSync(password, 12);
  })
  .get(function() {
    return this.passwordHash;
  });
User.virtual("usernameHash").get(function() {
  return bcrypt.hashSync(this.username, 12);
});

User.statics.findRootUsers = function() {
  return this.find({
    parent: {
      $exists: false
    }
  });
};

const User = mongoose.model("User", UserSchema);
module.exports = User;
