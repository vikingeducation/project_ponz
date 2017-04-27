var mongoose = require("mongoose"),
  Schema = mongoose.Schema,
  passportLocalMongoose = require("passport-local-mongoose");
const bluebird = require("bluebird");
mongoose.Promise = bluebird;

var UserSchema = new Schema(
  {
    referralCode: { type: String, unique: true },
    pointsSpent: 0,
    children: [
      {
        type: Schema.Types.ObjectId,
        ref: "User"
      }
    ]
  },
  { timestamps: true }
);

UserSchema.plugin(passportLocalMongoose, { usernameField: "email" });

var total = 0;
UserSchema.methods.populateChildren = async function(score = 80) {
  let user = await User.findById(this._id).populate("children").exec();

  if (score > 1) {
    score = Math.floor(score / 2);
  }
  user.children = await Promise.all(
    user.children.map(child => {
      child.score = score;
      total += score;
      child.populateChildren(score);
    })
  );
  console.log("total", total);
  return user;
};

const User = mongoose.model("User", UserSchema);
module.exports = User;
