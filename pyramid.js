const User = require("./models/User");
var pyramidObject = {};
var depth = 0;
const pyramid = async function(currentUserId) {
  let currentUser = await User.findOne({ _id: currentUserId });
  let referralArray = currentUser.referrals;

while(makeObject(referralArray) !== false){}
return pyramidObject
};

const makeObject = async function(refArray) {
  let newArray = [];
  refArray.forEach(i => {
    let thisRef = await User.findOne({ _id: i });
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
