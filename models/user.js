const mongoose = require("mongoose"),
  Schema = mongoose.Schema,
  passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new Schema(
  {
    referralCode: { type: String, unique: true },
    children: [
      {
        type: Schema.Types.ObjectId,
        ref: "User"
      }
    ],
    pointsSpent: { type: Number, default: 0 },
    itemsBought: [
      {
        type: Schema.Types.ObjectId,
        ref: "Item"
      }
    ]
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
        score = Math.floor(40 / depth);
      }
      initialUser.totalScore += score;
      return child.populateChildren(initialUser, score, depth * 2);
    })
  );
  return user;
};

const User = mongoose.model("User", UserSchema);
module.exports = User;
