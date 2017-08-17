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
  let objects = [];
  const makeObject = async function(refArray) {
    let newArray = [];
    pyramidObject[depth] = refArray;
    depth++;
    Promise.all(
      refArray.map(async function(i) {
        let user = await User.findOne({ _id: i._id }).populate("referrals");
        return user.referrals;
      })
    ).then(resultArray => {
      objects = [];

      resultArray.forEach(el => {
        objects = objects.concat(el);
      });
      pyramidObject[depth] = objects;
    });
  };
  while (objects.length > 0) {
    makeObject(referralArray);
  }
  depth = 0;
  keepLooping = false;
  // }
  // keepLooping = false;
  return pyramidObject;
};

module.exports = pyramid;
