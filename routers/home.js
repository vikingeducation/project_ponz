const express = require('express');
const app = express();
const router = express.Router();
const User = require('./../models/User');
const mongoose = require('mongoose');
const passport = require('passport');

// 1
router.get('/', async (req, res) => {
  let user;
  let referrer;
  let userArr;
  try {
    user = await User.findById(req.user.id);
    if (user.referrer) {
      referrer = await User.findById(user.referrer);
    }
    userArr = await User.findAll({ referrer: user._id });

    userArr.forEach(user => {
      userArr1 = await User.findAll({referrer: user._id})
      })

  } finally {
    if (req.user) {
      res.render('home', { referrer, user });
    } else {
      res.redirect('/login');
    }
  }
});

// 2
router.get('/login', (req, res) => {
  res.render('login');
});

router.get('/register', (req, res) => {
  res.render('register');
});

router.get('/register/:id', (req, res) => {
  res.render('register');
});

// 3
router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
  })
);

router.post('/register/:id', async (req, res, next) => {
  let { username, password } = req.body;
  let currentUser = new User({ username, password });
  currentUser.referrer = req.params.id;
  currentUser.save((err, user) => {
    req.login(user, function(err) {
      if (err) {
        return next(err);
      }
      return res.redirect('/');
    });
  });
});

// 4
router.post('/register', (req, res, next) => {
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

// 5
router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

module.exports = router;
