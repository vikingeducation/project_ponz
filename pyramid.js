const User = require("./models/User");

let keepLooping = true;
var pyramidObject = {};
var depth = 0;
var referralArray = [];
const pyramid = async function(currentUserId) {
  let currentUser = await User.findOne({ _id: currentUserId }).populate(
    "referrals"
  );
  referralArray = currentUser.referrals;
  console.log(referralArray);
  console.log("here");

  while (keepLooping === true) {
    makeObject(referralArray);
  }
  keepLooping = false;
  return pyramidObject;
};

const makeObject = async function(refArray) {
  let newArray = [];
  pyramidObject[depth] = refArray;
  depth++;
  //console.log(refArray.length);
  // TODO fix this promise issue - skipping the newArray.length validation below
  for (let i = 0; i < refArray.length; i++) {
    //let id = i._id;

    let thisRef = User.findOne({ _id: i._id }).populate("referrals");
    console.log("top of loop");
    newArray = newArray.concat(i.referrals);
    console.log("newArray");
    console.log(newArray);
  }

  console.log("after each");
  if (newArray.length > 0) {
    //  console.log(newArray);
    pyramidObject[depth] = newArray;
    depth++;
    referralArray = newArray;
    makeObject(newArray);
  } else {
    console.log("done");
    depth = 0;
    keepLooping = false;
  }
};

module.exports = pyramid;
