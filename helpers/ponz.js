const PonzHelper = {};

PonzHelper.originalUserPoints = function(distance) {
  const points = [40, 20, 10, 5, 2];

  if (distance >= 5) {
    return 1;
  } else {
    return points[distance];
  }
};

PonzHelper.increment = value => {
  return value + 1;
};

module.exports = PonzHelper;
