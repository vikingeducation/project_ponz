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
  // console.log(referralArray);
  // console.log("here");

  // while (keepLooping === true) {
  makeObject(referralArray);
  // }
  // keepLooping = false;
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
    });
    pyramidObject[depth] = objects;

    if (objects.length > 0) {
      // console.log("this is objects");
      // console.log(objects);
      // console.log(pyramidObject);
      //depth++;
      referralArray = objects;
      makeObject(objects);
    } else {
      //  console.log("done");
      depth = 0;
      keepLooping = false;
    }
    // console.log(objects);
    // console.log("result array");
  });
  //   console.log("top of loop");
  //   console.log(thisRef);
  //   newArray = newArray.concat(thisRef.referrals);
  //   console.log("newArray");
  //   console.log(newArray);
  // }

  // console.log("after each");
  console.log(pyramidObject);
};

module.exports = pyramid;
