const User = require('../models').User;

const calculatePoints = referralLevel => {
  let points;

  switch(referralLevel) {
  case 1:
    points = 40;
    break;
  case 2:
    points = 20;
    break;
  case 3:
    points = 10;
    break;
  case 4:
    points = 5;
    break;
  case 5:
    points = 2;
    break;
  default:
    points = 1;
  }

  return points;
};

const addPointsToReferrers = (referringUserId, level) => {
  return new Promise((resolve, reject) => {
    User.findById(referringUserId)
      .then(user => {
        user.points += calculatePoints(level);
        user.save();

        if (user.referredBy) {
          level += 1;
          addPointsToReferrers(user.referredBy, level);
        }

        resolve();
      })
      .catch(e => reject(e));
  });
};

module.exports = { calculatePoints, addPointsToReferrers };
