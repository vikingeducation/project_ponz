// mongoose
let User = new User({
  email: String,
  password: String,
  ponzPoints: Number,
  referrer: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  referrees: [
    {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  ]
});

descendents: [
  {
    level: Integer,
    user: {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  }
];

// assigning points
let user = userWhoJustSignedUp;
let i = 40;
let originalUser;

while (user.referrer) {
  originalUser = user;
  User.findById({ _id: user.referrer })
    .populate("referrees", "referrer")
    .then(user => {
      user.referrees.push(originalUser);
      user.points += i;
      user.save();
      if (i > 1) {
        i = Math.floor(i / 2);
      }
    });
}

// display pyramid
let _id = userToDisplay;
let i = 1;
let referreesObj = {};

User.find({ _id }).populate("referrees").then(user => {
  if (user.referrees) {
    referreesObj[`level${i}`] = user.referrees;
    user.referrees.forEach(referree => {
      while (referree.referrees) {
        i++;
        referreesObj[`level${i}`] = user.referrees;
        User.find({ _id: referree._id })
          .populate("referrees")
          .then(subreferree => {
            referree = subreferree;
          });
      }
    });
  }
});

res.locals.referrees = [];

Object.key(referreesObj).forEach(arrOfReferrees => {
  res.locals.referrees.push(referreesObj.arrOfReferrees);
});
/// results in referrees = [[level1], [level2], [level3], [level4], [level5]]
