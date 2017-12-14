const PointsHelper = {};

let pointsObj = {
  1: "40",
  2: "20",
  3: "10",
  4: "5",
  5: "2"
};

PointsHelper.pointsCalculator = a => {
  if (pointsObj[a]) {
    return pointsObj[a];
  } else {
    return "1";
  }
};

module.exports = PointsHelper;
