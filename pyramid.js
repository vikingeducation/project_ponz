const User = require("./models/User");

var pyramidObject = {};
var depth = 0;
const pyramid = async function(currentUserId) {
  console.log("empty array?");
  console.log(currentUserId);
  let currentUser = await User.findOne({ _id: currentUserId }).populate(
    "referrals"
  );
  console.log(currentUser);
  let referralArray = currentUser.referrals;
  console.log(referralArray);
  console.log(referralArray);

  while (makeObject(referralArray) !== false) {}
  return pyramidObject;
};

const makeObject = function(refArray) {
  let newArray = [];
  refArray.forEach(i => {
    let id = i._id;
    let thisRef = User.findOne({ id: id }).populate("referrals");
    if (thisRef.referrals !== []) {
      newArray = newArray.concat(i.referrals);
    }
  });
  if (newArray !== []) {
    pyramidObject[depth] = newArray;
    depth++;
    makeObject(newArray);
  } else {
    return false;
  }
};

module.exports = pyramid;
