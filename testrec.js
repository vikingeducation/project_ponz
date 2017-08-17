const User = require("./models/User");

let keepLooping = true;
var pyramidObject = {};
var depth = 0;
var referralArray = [];
var objects = [];
var recursivePromise = new Promise(() => {
  pyramidObject[depth] = objects;

  depth++;
  Promise.all(
    objects.map(async function(i) {
      let user = await User.findOne({ _id: i._id }).populate("referrals");

      return user.referrals;
    })
  ).then(resultArray => {
    objects = [];
    resultArray.forEach(el => {
      objects = objects.concat(el);
    });
    pyramidObject[depth] = objects;

    if (objects.length > 0) {
      otherRecursivePromise.then(objects => {
        recursivePromise;
      });
    } else {
      return pyramidObject;
    }
  });
});
var otherRecursivePromise = new Promise(() => {
  pyramidObject[depth] = objects;

  depth++;
  Promise.all(
    objects.map(async function(i) {
      let user = await User.findOne({ _id: i._id }).populate("referrals");

      return user.referrals;
    })
  ).then(resultArray => {
    objects = [];
    resultArray.forEach(el => {
      objects = objects.concat(el);
    });
    pyramidObject[depth] = objects;

    if (objects.length > 0) {
      recursivePromise.then(objects => {
        otherRecursivePromise;
      });
    } else {
      return pyramidObject;
    }
  });
});
const pyramid = async function(currentUserId) {
  let currentUser = await User.findOne({ _id: currentUserId }).populate(
    "referrals"
  );
  referralArray = currentUser.referrals;
  // console.log(referralArray);
  // console.log("here");

  // while (keepLooping === true) {
  recursivePromise.then(() => {
    console.log("then");
    return pyramidObject;
  });
  //makeObject(referralArray);
};
module.exports = pyramid;
