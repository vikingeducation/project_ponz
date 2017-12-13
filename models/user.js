const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const uniqueValidator = require("mongoose-unique-validator");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    fname: { type: String, required: true },
    lname: { type: String, required: true },
    displayName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    parentId: { type: Integer, required: true },
    childIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "User"
      }
    ],
    ponzPoints: Integer
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
    this.passwordHash = bcrypt.hashSync(value, 8);
  });

const User = mongoose.model("User", UserSchema);

module.exports = User;
