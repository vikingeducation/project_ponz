const User = require("./models/User");
var payOut = async function(referrerId, referralId) {
  try {
    var zref = await User.update(
      { _id: referrerId },
      { $push: { referrals: referralId } }
    );
  } catch (e) {}
  let currentPayout = 40;
  while (referrerId != 1) {
    let foundReferrer = await User.findOne({ _id: referrerId });
    let newTotal = foundReferrer.AnkhMorporkDollars + currentPayout;

    try {
      var z = await User.update(
        { _id: referrerId },
        { AnkhMorporkDollars: newTotal }
      );
    } catch (e) {}
    referrerId = foundReferrer.referrerId;
    currentPayout *= 0.5;
    if (currentPayout < 1) {
      currentPayout = 1;
    }
  }
};
module.exports = payOut;
