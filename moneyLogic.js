//someone registers
// they pay to the system
//>> the sytem then does a payout to all connected referrers
//register>40>20>10>5>2>1
const User = require("./models/User");
var payOut = async function(referrerId) {
  console.log("look at all the money");
  let currentPayout = 40;
  while (referrerId != 1) {
    let foundReferrer = await User.find({ _id: referrerId });
    console.log(foundReferrer);
    let oldMoney = foundReferrer.AnkhMorporkDollars;
    let y = await User.update(
      { _id: referrerId },
      { AnkhMorporkDollars: oldMoney }
    );
    console.log("mo money");
    console.log(currentPayout);
    console.log(referrerId);
    referrerId = foundReferrer.referrerId;
    currentPayout *= 0.5;
    if (currentPayout < 1) {
      currentPayout = 1;
    }
  }
};
module.exports = payOut;
