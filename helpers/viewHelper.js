const ViewHelper = {
  any: items => {
    return items ? items.length : 0;
  },

  displayDate: date => {
    date = new Date(date);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();
    return `${ month }/${ day }/${ year }`;
  },

  directlyReferredBy: (referredUser, referringUser) => {
    debugger;
    if (!referredUser.referredBy.equals(referringUser._id)) {
      return false;
    }
    return true;
  }
};

module.exports = ViewHelper;
