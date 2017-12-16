const express = require('express')
const app = express()
const router = express.Router()
const User = require('./../models/User')
const mongoose = require('mongoose')
const passport = require('passport')
const moment = require('moment')

// top-down level recursion. Starts with master user and drills down to children
const findTree = async function (user, distance, date) {
  let usrArr = await User.find({ referrer: user._id }) // array of all the "children" users of current user

  console.log('====================User', user, 'userid', user._id)
  console.log('============================UserArray', usrArr)
  // base case means there is no children
  //if (usrArr === []) {
   // return [user.username, distance, user.date]
    let recursiveArray = []
    let temp
    for (let i = 0; i < usrArr.length; i++) {
      temp = await findTree(usrArr[i], distance + 1)
      recursiveArray = recursiveArray.concat(temp)
      // need to map to prevent nested arrays
      // temp.map(x => {
      //   recursiveArray.push(x) // push to make sure "children" are listed after the "parent"
      // })
    }
    console.log(
      '========================RecursiveArrayBeforeUnshift',
      recursiveArray
    )

    // let recursiveArray = await usrArr.map(async function(x) {
    //   let y = await findTree(x, distance + 1);
    //   return y;
    // });

    // get parent back since we only pushed the children
    recursiveArray.unshift([user.username, distance, user.date])
    console.log(
      '========================RecursiveArrayAfterUnshift',
      recursiveArray
    )
    return recursiveArray
  }
}

const calcPoints = distance => {
  switch (distance) {
    case 1:
      return 40
    case 2:
      return 20
    case 3:
      return 10
    case 4:
      return 5
    case 5:
      return 2
    default:
      return 1
  }
}

const pyramid = userArr => {
  // pyramidObj will have key of distance and the number of elements in each distance and width for rendering
  let pyramidObj = {}
  let pyramidArr

  userArr.forEach((e, i) => {
    if (pyramidObj[e[1]][0]) {
      pyramidObj[e[1]][0] += 1
    } else {
      pyramidObj[e[1]][0] = 1
    }
  })

  let numRows = Object.keys(pyramidObj).length
  let amount = numRows

  // for (let i = 0; i < numRows; i++) {
  //   pyramidObj[i][1] = (100 / amount)
  //   amount--
  // }

  pyramidArr = Object.entries(pyramidObj)

  return pyramidArr
}

router.get('/', async (req, res) => {
  let user
  let referrer
  let userArray
  let sum = 0
  let pyramidArr
  try {
    user = await User.findById(req.user.id)

    // recursively find array of users that is one flat level in terms of hierarchy
    userArray = await findTree(user, 0)

    // before replace distance with points, make triangle
    pyramidArr = pyramid(userArray)

    console.log('========================', pyramidArr)

    // need to remove current user from the array
    userArray.shift()

    console.log('========================finalUserArray', userArray)

    // white space
    userArray.forEach(
      (x, i) => (userArray[i][3] = '     '.repeat(userArray[i][1]))
    )

    // replace distance with appropriate points
    userArray.forEach((x, i) => (userArray[i][1] = calcPoints(x[1])))

    // calculate total sum
    userArray.forEach(x => (sum += x[1]))

    // reformat date
    userArray.forEach(
      (x, i) => (userArray[i][2] = moment(x[2]).format('YYYY-MM-DD'))
    )

    // render referrer name
    if (user.referrer) {
      referrer = await User.findById(user.referrer)
    }
  } finally {
    if (req.user) {
      res.render('home', { referrer, user, userArray, sum, pyramidArr })
    } else {
      res.redirect('/login')
    }
  }
})

// 2
router.get('/login', (req, res) => {
  res.render('login')
})

router.get('/register', (req, res) => {
  res.render('register')
})

router.get('/register/:id', (req, res) => {
  res.render('register')
})

// 3
router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
  })
)

router.post('/register/:id', async (req, res, next) => {
  let { username, password } = req.body
  let currentUser = new User({ username, password })
  currentUser.referrer = req.params.id
  currentUser.save((err, user) => {
    req.login(user, function (err) {
      if (err) {
        return next(err)
      }
      return res.redirect('/')
    })
  })
})

// 4
router.post('/register', (req, res, next) => {
  const { username, password } = req.body
  const user = new User({ username, password })
  user.save((err, user) => {
    req.login(user, function (err) {
      if (err) {
        return next(err)
      }
      return res.redirect('/')
    })
  })
})

// 5
router.get('/logout', function (req, res) {
  req.logout()
  res.redirect('/')
})

module.exports = router
