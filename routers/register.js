const express = require('express');
const router = express.Router();
const { loggedOutOnly } = require('../services/session');
const User = require('../models').User;
const randomstring = require("randomstring");
const { addPointsToReferrers } = require('../helpers/pointsHelper');

router.get('/:code', loggedOutOnly, (req, res) => {
  User.findOne({ referralCode: req.params.code })
    .then(referringUser => {
      if (!referringUser) throw 'noUser';
      res.render('register', { referringUser});
    })
    .catch(e => {
      if (e == 'noUser') {
        res.status(404).send('404 USER NOT FOUND');
      } else {
        res.status(500).send(e.stack);
      }
    });
});

router.post('/', loggedOutOnly, async (req, res, next) => {
  const referralCode = req.body.referralCode;
  const referringUser = await User.findOne({ referralCode });

  const userAttrs = {
    fullName: req.body.fullName,
    email: req.body.email,
    password: req.body.password,
    referralCode: randomstring.generate(7),
    referredBy: referringUser
  };

  const newUser = new User(userAttrs);
  newUser.save()
    .then(() => {
      addPointsToReferrers(referringUser.id, 1);

      req.login(newUser, err => {
        if (err) next(err);
        res.redirect('/home');
      });
    })
    .catch(e => {
      if (e.message) {
        req.flash('error', e.message);
        res.redirect('back');
      } else {
        res.status(500).send(e.stack);
      }
    });
});

module.exports = router;
