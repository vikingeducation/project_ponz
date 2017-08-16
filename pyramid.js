const User = require("./models/User");

var pyramidObject = {};
var depth = 0;
const pyramid = async function(currentUserId) {
  let currentUser = await User.findOne({ _id: currentUserId }).populate(
    "referrals"
  );
  let referralArray = currentUser.referrals;

  while (makeObject(referralArray) !== false) {}
  return pyramidObject;
};

const makeObject = function(refArray) {
  let newArray = [];
  pyramidObject[depth] = refArray;
  depth++;
  // TODO fix this promise issue - skipping the newArray.length validation below
  refArray.forEach(i => {
    let id = i._id;
    let thisRef = User.findOne({ _id: id }).populate("referrals");
    newArray = newArray.concat(i.referrals);
    console.log(i.referrals);
  });
  if (newArray.length > 0) {
    pyramidObject[depth] = newArray;
    depth++;
    makeObject(newArray);
  } else {
    depth = 0;
    return false;
  }
};

module.exports = pyramid;
