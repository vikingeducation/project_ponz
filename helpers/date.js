const DateHelper = {};

DateHelper.formatDate = date => {
  return date.toString().slice(4, 15);
};

module.exports = DateHelper;
