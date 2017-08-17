const User = require("./models/User");

let keepLooping = true;
var pyramidObject = {};
var depth = 0;
var referralArray = [];
var objects = [];
const pyramid = async function(currentUserId) {
  var pyramidObject = {};
  var depth = 0;
  var referralArray = [];
  var objects = [];
  let currentUser = await User.findOne({ _id: currentUserId }).populate(
    "referrals"
  );
  referralArray = currentUser.referrals;
  objects = currentUser.referrals;
  const makeObject = async function(refArray) {
    pyramidObject[depth] = refArray;
    depth++;
    await Promise.all(
      refArray.map(async function(i) {
        let user = await User.findOne({ _id: i._id }).populate("referrals");
        return user.referrals;
      })
    ).then(resultArray => {
      objects = [];

      resultArray.forEach(el => {
        objects = objects.concat(el);
      });
      if (objects.length > 0) {
        pyramidObject[depth] = objects;
      }
    });
  };

  while (objects.length > 0) {
    await makeObject(objects);
  }

  depth = 0;
  keepLooping = false;
  return pyramidObject;
};

module.exports = pyramid;
