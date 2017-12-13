const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const uniqueValidator = require("mongoose-unique-validator");
const Schema = mongoose.Schema;

const deepPopulate = require("mongoose-deep-populate")(mongoose);

const UserSchema = new Schema(
  {
    fname: { type: String, required: true },
    lname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    parentId: String,
    childIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "User"
      }
    ],
    ponzPoints: Number,
    depth: { type: Number, default: 0 }
  },
  {
    timestamps: true
  }
);

UserSchema.plugin(deepPopulate /* more on options below */);

UserSchema.virtual("displayName").get(function() {
  return this.fname + " " + this.lname;
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

const User = mongoose.model("User", UserSchema);

module.exports = User;
