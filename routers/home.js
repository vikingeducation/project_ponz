'use strict';

//==================
// home router
//==================

const Express = require('express');
const router = Express.Router();
const mongoose = require('mongoose');
const User = require('./../models/User');
const passport = require('passport');

// 1
router.get('/', async (req, res) => {
  //testing recursive listing
  try{
    var items = [
        { name: "foo1" },
        { name: "foo2" },
        { name: "foo3", items: [
            { name: "foo4" },
            { name: "foo5" },
            { name: "foo6", items: [
                { name: "foo7" }
            ]}
        ]},
        { name: "foo8" }
    ];

    const user = await User.findById(req.user._id).populate('User').then(results => {console.log(results)})

    if (req.user) {
      res.render('home', {
        user: req.user,
        children: user.children, //needs to be a nested object
        items: items,
        link: `/ponvert/${req.user._id}`
      });
    } else {
      res.redirect('/login');
    }
  }

  catch(err){
    console.log(err)
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


//some work on recursion
// func = (ob, depth) => {
//   if(obj.children == []){
//       return obj
//   }
//
//   depth = (typeOf depth === 'undefined') ? 0 : depth
//   obj.children.forEach(child => {
//     recursive(child, depth + 1)
//   })
// }
//
// obj = {}
//
// recurse(user, obj) => {
//   user.children.forEach((child) => {
//     if(!obj[child]){
//       obj[child] = {}
//       //get the child object then
//       recurse(child, obj[child])
//     }
//   })
//
//   return obj
// }
//
// arr = ['<ul><li>'obj.email</li><ul>`,]
//
// while(Object.keys(obj)){
//   let childIds = Object.keys(obj)
//   //find the object of each child ->
//   childIds.forEach(childId => {
//     arr.push(``)
//   })
// }
// //display more comments
// /*
// -> post
// */
//
// //[parent, childofparent, childofchildofparent, ]
