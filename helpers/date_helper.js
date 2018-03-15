const moment = require("moment");

const DateHelper = {};

DateHelper.mmddyy = date => {
  return moment(date).format("MM/DD/YY");
};

module.exports = DateHelper;
