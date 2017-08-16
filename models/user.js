// User
// 	username
// 	passwordHash
// 	ponzBucks
// 	parents: [nearest first]
// 	children: [direct children as reference]

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
const uniqueValidator = require("mongoose-unique-validator");

const UserSchema = new Schema(
  {
    username: {type: String, required: true, unique: true},
    passwordHash: {type: String, required: true},
    ponzBucks: Number,
    parents: [{
    	type: Schema.Types.ObjectId,
      ref: "User"
    }],
    children: [{
    	type: Schema.Types.ObjectId,
      ref: "User"
    }],
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

  // UserSchema.virtual("generateCode")
  // .set(function(username) {
  //   this.referralCode = bcrypt.hashSync(username, 2);
  // });

const User = mongoose.model("User", UserSchema);

module.exports = User;