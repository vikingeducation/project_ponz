'use strict';

//==================
// home router
//==================

const Express = require('express');
const router = Express.Router();
const mongoose = require('mongoose');
const { User } = require('./../models');
const passport = require('passport');

// 1
router.get('/', async (req, res, next) => {
  //testing recursive listing
  console.log(1);
  try {
    if (req.user) {
      const user = await User.findById(req.user._id)
        .populate({
          path : 'children',
          populate : {
            path : 'children',
            populate : {
              path : 'children',
              populate : {
                path : 'children',
                populate : {
                  path : 'children'
                }}}}})
        // .populate(
        //   {path: 'children'}.populate({path: 'children'})
        // )

      console.log('user: ', user)

      let pointsCalc = (children, divisor) => { //[{}]
        if(!divisor){
          var divisor = 1
          console.log('divisor set!');
        }

        let points = 0;
        if(divisor !== 1){
          points += children.length / (2 * divisor)
        } else {
          console.log('points declared!')
          points += 1
        }

        if(children.children){ //if
          points += pointsCalc(children.children, divisor + 1)
        }

        return points
      }

      console.log('user.children: ' + user.children)
      let count = pointsCalc(user.children)//[{}]

      res.render('home', {
        user: req.user,
        children: user.children, //needs to be a nested object
        link: `/ponvert/${req.user._id}`,
        points: count
      })
    }
    else {
      res.redirect('/login');
    }
  }

  catch (err) {
    console.log(err);
    next(err)
  }
});

// 2
router.get('/login', (req, res) => {
  res.render('login');
});

router.get('/register', (req, res) => {
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

// 4

router.post('/register', (req, res, next) => {
  const { email, password } = req.body;
  const user = new User({ email, password });
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
