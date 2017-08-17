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
  Promise.all(
    refArray.map(async function(i) {
      let user = await User.findOne({ _id: i._id }).populate("referrals");
      return user.referrals;
    })
  ).then(resultArray => {
    let objects = [];
    resultArray.forEach(el => {
      objects = objects.concat(el);
    });
    console.log(objects);
    console.log("result array");
    console.log(resultArray);
  });

  // for (let i = 0; i < refArray.length; i++) {
  //   //let id = i._id;
  //
  //   let thisRef = await User.findOne({ _id: refArray[i]._id }).populate(
  //     "referrals"
  //   );
  //
  //   console.log("top of loop");
  //   console.log(thisRef);
  //   newArray = newArray.concat(thisRef.referrals);
  //   console.log("newArray");
  //   console.log(newArray);
  // }

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
