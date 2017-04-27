const helpers = {};

helpers.pyramidContainerWidth = pyramid => {
  return `${pyramid.length * 60}px`;
};

helpers.pyramidHeight = pyramid => {
  let height = pyramid.length * 52;
  return `${height}px`;
};

helpers.pyramidWidth = pyramid => {
  let width = pyramid.length * 60 / 2;
  return `${width}px`;
};

helpers.indent = depth => {
  let indent = depth > 0 ? 50 : 0;
  return `${indent}px`;
};

helpers.valueCalc = depth => {
  let values = [40, 20, 10, 5, 2];
  let value = depth < 5 ? values[depth] : 1;
  return `$${value}`;
};

module.exports = helpers;
