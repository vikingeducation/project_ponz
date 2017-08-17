const User = require("./models/User");

let keepLooping = true;
var pyramidObject = {};
var depth = 0;

const pyramid = async function(currentUserId) {
  let currentUser = await User.findOne({ _id: currentUserId }).populate(
    "referrals"
  );
  let referralArray = currentUser.referrals;
  makeObject();
  while (keepLooping === true) {}
  keepLooping = false;
  return pyramidObject;
};

const makeObject = async function(refArray) {
  let newArray = [];
  pyramidObject[depth] = refArray;
  depth++;
  // TODO fix this promise issue - skipping the newArray.length validation below
  for (let i = 0; i < refArray.length; i++) {
    let id = i._id;
    let thisRef = await User.findOne({ _id: id }).populate("referrals");
    newArray = newArray.concat(i.referrals);
    console.log("here");
  }
  console.log("after each");
  if (newArray.length > 0) {
    pyramidObject[depth] = newArray;
    depth++;
    makeObject(newArray);
  } else {
    depth = 0;
    keepLooping = false;
  }
};

module.exports = pyramid;
