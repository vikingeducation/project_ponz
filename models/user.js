var mongoose = require("mongoose"),
  Schema = mongoose.Schema,
  passportLocalMongoose = require("passport-local-mongoose");

var User = new Schema({
  referralCode: { type: String, unique: true },
  parentId: {type: Integer},
  children: {type: Array}
});

User.plugin(passportLocalMongoose, { usernameField: "email" });

module.exports = mongoose.model("User", User);




Parent id: 17
  [{1:23 2:43 3:56}, {1:73}]

  Child-1 id: 23
    [{1:43 2:56}, {1:74}]

    Child-1-1 id: 43
    [{1:56}]

      Child-1-1-1 id:56

    Child-1-2 id: 74
      [{}]

  Child-2 id: 73
    [{}]

User: 17 (23, 73)

  User: 23 (43, 74)

    User: 43 (56)

