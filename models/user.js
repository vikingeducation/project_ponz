var mongoose = require("mongoose"),
  Schema = mongoose.Schema,
  passportLocalMongoose = require("passport-local-mongoose");
const bluebird = require("bluebird");
mongoose.Promise = bluebird;

var User = new Schema({
  referralCode: { type: String, unique: true },
  pointsSpent: 0,
  children: [
    {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  ]
}, {timestamps: true});

User.plugin(passportLocalMongoose, { usernameField: "email" });

// User.methods.populateChildren = function(depth=0) {
//   let user = await User.findById(this._id).populate("children").exec();
//   user.depth = depth;
//   user.children = await Promise.all(
//     user.children.map(child => child.populateChildren(depth + 1))
//   );
//   return user;
// }

module.exports = mongoose.model("User", User);

