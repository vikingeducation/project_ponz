var mongoose = require("mongoose"),
  Schema = mongoose.Schema,
  passportLocalMongoose = require("passport-local-mongoose");
const bluebird = require("bluebird");
mongoose.Promise = bluebird;

var User = new Schema({
  referralCode: { type: String, unique: true },
  children: [
    {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  ]
});

User.plugin(passportLocalMongoose, { usernameField: "email" });

module.exports = mongoose.model("User", User);

// User: 17 (23, 73)

//   User: 23 (43, 74)

//     User: 43 (56)
