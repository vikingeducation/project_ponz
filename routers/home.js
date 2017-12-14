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
                .populate({
                  path : 'parent',
                  populate : {
                    path : 'parent',
                    populate : {
                      path : 'parent',
                      populate : {
                        path : 'parent',
                        populate : {
                          path : 'parent'
                        }}}}})
        // repl test
        // User.findById('5a31a8e52b0be70e6240ce30').populate({path : 'children', populate : {path : 'children', populate : { path : 'children', populate : { path : 'children', populate : { path : 'children'}}}}}).then(lg)

      console.log('user: ', user)

      let pointsCalc = (children, divisor) => { //[{}]

        if(children === undefined){
          return 0
        }

        let points = 0;
        if(!divisor){
          var divisor = 1
          console.log('divisor set!');
          points += children.length
        } else {
          points += children.length / (divisor)
        }

        children.forEach((child) => {
          //if
          points += pointsCalc(child.children, divisor * 2)
        })

        return points
      }

      let depth = async (obj) => {

        try {
          let depthNum = 0

          let parent = obj.parent

          if(parent){
            depthNum += 1
          } else {
            depthNum += await depth(parent)
          }

          return depthNum
          //
          // let parent;
          // console.log("\x1b[33m", 'parentid is ' + parentid)
          // while(parentid){
          //   parent = await User.findById(parentid)
          //   parentid = parent.id
          //   depthNum += 1
          // }
          //
          // return depthNum
        }

        catch(err){
          console.log(err);
        }

      }


      // let num = await depth(user)
      //
      // let count;
      // if(num === 0){
      //   console.log("\x1b[33m", 'num is 0')
      //   //[{}]
      // } else {
      //   console.log("\x1b[33m", num)
      //   count = pointsCalc(user.children, num)//[{}]
      // }
      // //console.log("\x1b[33m", num);

      let count = pointsCalc(user.children)

      let somenum = await depth(user)
      console.log("\x1b[33m", somenum);

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
