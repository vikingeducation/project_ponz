const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const uniqueValidator = require("mongoose-unique-validator");
var deepPopulate = require("mongoose-deep-populate")(mongoose);
const Schema = mongoose.Schema;

const UserSchema = mongoose.Schema(
  {
    email: {type: String, required: false, unique: true},
    passwordHash: {type: String, required: true},
    parent: {type: Schema.Types.ObjectId, ref: "User"},
    children: [{type: Schema.Types.ObjectId, ref: "User"}]
  },
  {timestamps: true}
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

PostSchema.plugin(deepPopulate);

const User = mongoose.model("User", UserSchema);

module.exports = User;

/*
connecting to the mongodb database on heroku

heroku addons:open MONGODB_URI
