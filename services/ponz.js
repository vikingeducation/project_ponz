const User = require("../models/User");

let ponz = {};

ponz.augmentParents = async user => {
  let distance = 0;
  let parent = await User.findById(user.parent);
  parent.children.push(user.id);
  parent.save();
  while (user.parent) {
    let parent = await User.findById(user.parent);
    if (parent) {
      parent.points += _pointsByDistance(distance);
      parent.save();
      distance++;
    }
    user = parent;
  }
};

function _pointsByDistance(distance) {
  const points = [40, 20, 10, 5, 2];
  if (distance < 5) return points[distance];
  return 1;
}
module.exports = ponz;
