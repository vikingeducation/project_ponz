const express = require('express');
const app = express();
const router = express.Router();
const User = require('./../models/User');
const Cereal = require('./../models/Cereal');
const mongoose = require('mongoose');
const passport = require('passport');

const findTree = async function(user, distance) {
  let usrArr = await User.find({
    referrer: user._id,
  });
  console.log('user', user, 'userid', user._id);
  console.log(usrArr);
  if (usrArr === []) {
    return [user.username, distance];
  } else {
    let recursiveArray = [];
    let temp;
    for (let i = 0; i < usrArr.length; i++) {
      temp = await findTree(usrArr[i], distance + 1);
      recursiveArray = recursiveArray.concat(temp);
    }
    // console.log("========================RECURSIVEARRAY", recursiveArray);
    // let recursiveArray = await usrArr.map(async function(x) {
    //   let y = await findTree(x, distance + 1);
    //   return y;
    // });
    recursiveArray.unshift([
      user.username,
      distance,
      user.date.toString().substring(4, 15),
    ]);
    return recursiveArray;
  }
};

const calcPoints = distance => {
  switch (distance) {
    case 1:
      return 40;
      break;
    case 2:
      return 20;
      break;
    case 3:
      return 10;
      break;
    case 4:
      return 5;
      break;
    case 5:
      return 2;
      break;
    default:
      return 1;
  }
};

router.get('/', async (req, res, next) => {
  try {
    result = await Cereal.find();
  } catch (e) {
    next(e);
  }
  console.log(req.user);
  let user = req.user;
  res.render('shop', {
    result,
    user,
  });
});

router.get('/:id/buy', async (req, res, next) => {
  let user = req.user;
  let userTree;
  let points = 0;
  let cereal;
  try {
    cereal = await Cereal.findById(req.params.id);
    userTree = await findTree(req.user, 0);
  } catch (e) {
    next(e);
  }
  userTree.shift();
  userTree.forEach(x => (points += calcPoints(x[1])));
  console.log(points);
  points -= user.pointsSpent;
  console.log(points);
  if (points >= cereal.price) {
    user.pointsSpent += cereal.price;
    try {
      await User.findByIdAndUpdate(user._id, user);
    } catch (e) {
      next(e);
    }
    res.render('buy', {
      cereal,
    });
  } else {
    res.render('poor');
  }
});

router.get('/:id', async (req, res, next) => {
  let cereal;
  try {
    cereal = await Cereal.findById(req.params.id);
  } catch (e) {
    next(e);
  }
  res.render('cereal', {
    cereal,
  });
});

module.exports = router;
