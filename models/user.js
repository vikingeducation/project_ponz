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

module.exports = mongoose.model("User", User);


//finding all children

//forEach on children [3342, 434334 ,5566]
  //findById
  //if(children)forEach on children

   //if(children)forEach on children


// [ {[email, [{[email, [{[email, [children]]}] ]}]]}] ]}, ]


//handlebars each child
//{{child.email}}
//{{if child.children}}
