let ponz = {};

ponz.clone = object => {
  return JSON.parse(JSON.stringify(object));
};

ponz.buildPyramid = user => {
  let pyramid = [1];
  let nextLevel = [];
  user.children.forEach(child => nextLevel.push(child));
  while (nextLevel.length) {
    pyramid.push(nextLevel.length);
    let users = nextLevel.slice(0);
    nextLevel = [];
    users.forEach(user => {
      user.children.forEach(child => nextLevel.push(child));
    });
  }
  return pyramid;
};

module.exports = ponz;
