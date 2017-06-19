const express = require('express');
const router = express.Router();
const models = require('./../models');
const User = models.User;
const passport = require('passport');

router.get("/", (req, res) => {
  console.log('no spaghett!!');
  res.render("register/index");
});

// this path is only reached when a user refers another
router.get("/:id", (req, res) => {
  let parent = req.params.id;
  res.render("register/ponzify", { parent });
});


router.post("/", (req, res, next) => {
  const { email, password } = req.body;
  const user = new User({ email, password });
  user.save((err, user) => {
    req.login(user, function(err) {
      if (err) {
        return next(err);
      }
      return res.redirect("/"); });
  });
});

const calculateScore = depth => {
  if (depth >= 4) {
    return 1;
  }

  return [20, 10, 5, 2][depth];
};

const updateScore = user => {
  let depth = -1;

  const updateScoreRecursively = user => {
    let parent = user.parent;
      if (parent) {
        depth++;
        let score = calculateScore(depth);
        User.findByIdAndUpdate(parent, {$inc: {score: score}}).then(updateScoreRecursively);
      } else {
        return Promise.resolve();
      }
  };
  return updateScoreRecursively(user);
};

router.post("/ponzify", (req, res) => {
  const { email, password, parent } = req.body;
  const score = 0;
  let newUser = new User({ email, password, parent, score });
  let currentUser;
  newUser.save()
    .then(results => {
      currentUser = results;
      return User.findByIdAndUpdate(parent, {
        $inc: { score: 40 },
        $push: { children: currentUser }
      })
    .then(user => {
      return updateScore(user);
    })
    .then(() => {
      req.login(currentUser, function(err) {
        if (err) {
          return next(err);
        }
        return res.redirect("/"); 
      });
    });
  });
});

module.exports = router;