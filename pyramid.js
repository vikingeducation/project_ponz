const User = require("./models/User");

const pyramid = async function(currentUserId) {
  let currentUser = await User.findOne({ _id: currentUserId });
  let referralArray = currentUser.referrals;
  referralArray.forEach(referral => {
    makeObject(referral);
  });
};

const makeObject = function() {};

module.exports = pyramid;
