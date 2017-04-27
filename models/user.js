var mongoose = require("mongoose"),
  Schema = mongoose.Schema,
  passportLocalMongoose = require("passport-local-mongoose");
const bluebird = require("bluebird");
mongoose.Promise = bluebird;

var UserSchema = new Schema(
  {
    referralCode: { type: String, unique: true },
    children: [
      {
        type: Schema.Types.ObjectId,
        ref: "User"
      }
    ],
    totalScore: { type: Number, default: 0 }
  },
  { timestamps: true }
);

UserSchema.plugin(passportLocalMongoose, { usernameField: "email" });

UserSchema.methods.populateChildren = async function(
  initialUser,
  initialScore = 40,
  depth = 1
) {
  let user = await User.findById(this._id).populate("children").exec();
  let score = initialScore;
  user.score = score;
  user.children = await Promise.all(
    user.children.map(child => {
      if (score > 1) {
        score = Math.floor(initialScore / depth);
      }
      initialUser.totalScore += score;
      return child.populateChildren(initialUser, score, depth * 2);
    })
  );
  return user;
};

const User = mongoose.model("User", UserSchema);
module.exports = User;



