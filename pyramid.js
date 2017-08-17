const User = require("./models/User");

let keepLooping = true;
var pyramidObject = {};
var depth = 0;
var referralArray = [];
var objects = [];
const pyramid = async function(currentUserId) {
  let currentUser = await User.findOne({ _id: currentUserId }).populate(
    "referrals"
  );
  referralArray = currentUser.referrals;
<<<<<<< HEAD

  makeObject(referralArray);
  return pyramidObject;
};

const makeObject = async function(refArray) {
  let newArray = [];
  pyramidObject[depth] = refArray;
  //  console.log("before");
  depth++;
  Promise.all(
    refArray.map(async function(i) {
      let user = await User.findOne({ _id: i._id }).populate("referrals");
      //  console.log("inside of the promise.all array");
      return user.referrals;
    })
  ).then(resultArray => {
    let objects = [];
    //console.log("inside the then from promise all");
    resultArray.forEach(el => {
      objects = objects.concat(el);
=======
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
>>>>>>> 9a4f123792cbbd33bb3177cadf14bdf7ed6bd9b9
    });
  };

  while (objects.length > 0) {
    await makeObject(objects);
  }

  depth = 0;
  keepLooping = false;
  // }
  // keepLooping = false;
  return pyramidObject;
};

module.exports = pyramid;
