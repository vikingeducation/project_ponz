var mongoose = require("mongoose");
const bcrypt = require("bcrypt");
var Schema = mongoose.Schema;

const UserSchema = mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    // referalId: [
    //   {
    //     type: Schema.Types.ObjectId,
    //     ref: "referal",
    //     required: true
    //   }
    // ],
    referalLink: { type: String, require: true },
    points: { type: Number, require: true }
  },
  {
    timestamps: true
  }
);

UserSchema.methods.validatePassword = function(password) {
  return bcrypt.compareSync(password, this.passwordHash);
};

UserSchema.virtual("password").set(function(value) {
  this.passwordHash = bcrypt.hashSync(value, 8);
});

var User = mongoose.model("User", UserSchema);

module.exports = User;
