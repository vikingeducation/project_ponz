const express = require('express');
const app = express();
const router = express.Router();
const User = require('./../models/User');
const mongoose = require('mongoose');
const passport = require('passport');

// 1
router.get('/', (req, res) => {
  if (req.user) {
    res.render('home', { user: req.user });
  } else {
    res.redirect('/login');
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
  try {
    let { username, password } = req.body;
    let currentUser = new User({ username, password });
    currentUser.referrer = req.params.id;

    console.log('========================CURRENTUSER', currentUser);
    let user1 = await User.findById(req.params.id);

    user1.referTree.push({
      id: currentUser.id,
      username: currentUser.username,
      points: 40
    });
    await User.findByIdAndUpdate(user1.id, user1);
    await user1.save();

    console.log('========================CURRENTUSERafterpush', currentUser);

    console.log('========================USER1', user1);
    if (user1.referrer) {
      let user2 = await User.findById(user1.referrer);

      let user1index = user2.referTree.findIndex(x => {
        return x.id === user1.id;
      });

      console.log('========================CURRENTUSERafterindex', currentUser);
      console.log('========================USER1INDEX', user1index);
      console.log(
        '========================USER2REFER.length',
        user2.referTree.length
      );

      let tempArray = user2.referTree.splice(user1index + 1);
      user2.referTree.push({
        id: currentUser.id,
        username: currentUser.username,
        points: 20
      });

      console.log('========================USER2', user2);

      // if (user2.referrer) {
      //   let user3 = await User.findById(user2.referrer);
      //   if (user3.referrer) {
      //     let user4 = await User.findById(user3.referrer);
      //   }
      // }
    }
    currentUser.save((err, user) => {
      req.login(user, function(err) {
        if (err) {
          return next(err);
        }
        return res.redirect('/');
      });
    });
  } catch (e) {
    next(e);
  }
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
