const express = require('express');
const router = express.Router();
const { loggedInOnly } = require('../services/session');
const User = require('../models').User;
const { calculatePoints } = require('../helpers/pointsHelper');

router.get('/', loggedInOnly, (req, res) => {
  let currentUser = req.user;

  findAllReferredUsers(currentUser)
    .then(user => {
      res.render('home', { user });
    })
    .catch(e => res.status(500).send(e.stack));
});

const findAllReferredUsers = currentUser => {
  return new Promise((resolve, reject) => {
    currentUser.referrals = [];
    const level = 1;
    getReferrals(currentUser, currentUser.id, level, resolve, reject);
  });
};

const getReferrals = (currentUser, userId, level, resolve, reject) => {
  User.findReferredUsers(userId)
    .then(referrals => {
      if (!referrals.length) {
        resolve(currentUser);
      } else {
        level += 1;
        for (let referral of referrals) {
          referral.pointsEarnedByOriginalReferrer = calculatePoints(level - 1);
          currentUser.referrals.push(referral);
          getReferrals(currentUser, referral.id, level, resolve, reject);
        }
      }
    })
    .catch(e => reject(e));
};

module.exports = router;
