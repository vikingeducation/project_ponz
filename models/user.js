const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
const uniqueValidator = require("mongoose-unique-validator");

const UserSchema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    ponzBucks: Number,
    // all ancestors
    parents: [
      {
        distance: Number,
        ancestor: {
          type: Schema.Types.ObjectId,
          ref: "User"
        }
      }
    ],
    // only direct children
    children: [
      {
        type: Schema.Types.ObjectId,
        ref: "User"
      }
    ],
    referralCode: String
  },
  {
    timestamps: true
  }
);

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
    this.passwordHash = bcrypt.hashSync(value, 12);
  });

const User = mongoose.model("User", UserSchema);

module.exports = User;
