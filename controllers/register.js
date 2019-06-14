const express = require('express');
const models = require('./../models');

const router = express.Router();
const User = models.User;

router.get('/', (req, res) => {
  res.render('register/index');
});

router.get('/:id', (req, res) => {
  res.render('register/referral', { parentId: req.params.id });
});

router.post('/', (req, res, next) => {
  const { username, password } = req.body;
  const user = new User({ username, password, points: 0 });

  user.save((err, user) => {
    req.login(user, function(err) {
      if (err) {
        return next(err);
      }
      return res.redirect('/');
    });
  });
});

router.post('/referral', (req, res, next) => {
  const { username, password, parent } = req.body;
  const user = new User({ username, password, parent, points: 0 });
  let newUser;

  user
    .save()
    .then(result => {
      newUser = result;

      return User.findByIdAndUpdate(parent, {
        $inc: { points: 40 },
        $push: { children: newUser }
      });
    })
    .then(parentUser => {
      parentUser.recursivelyUpdatePoints();

      req.login(newUser, function(err) {
        if (err) {
          return next(err);
        }
        return res.redirect('/');
      });
    });
});

module.exports = router;
