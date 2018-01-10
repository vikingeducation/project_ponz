const express = require('express');
const models = require('./../models');

const router = express.Router();
const User = models.User;

router.get('/', (req, res) => {
  res.render('register/index');
});

router.post('/', (req, res, next) => {
  const { username, password } = req.body;
  const user = new User({ username, password });
  user.save((err, user) => {
    req.login(user, function(err) {
      if (err) {
        return next(err);
      }
      return res.redirect('/');
    });
  });
});

module.exports = router;
