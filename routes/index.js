const express = require("express");
let router = express.Router();
const {
  loggedInOnly,
  loggedOutOnly
} = require("../services/session");

const User = require("../models/User");

module.exports = passport => {
  router.get("/", loggedInOnly, async (req, res, next) => {
    let user = req.user;

    // User populated with children
    //
    //   { _id: 5901013ee0706c0a621f1461,
    // fname: 'a',
    // lname: 'a',
    // email: 'a',
    // points: 80,
    // passwordHash: '$2a$08$09pOdqoXbNXlmudN7UX5B.i2NFh.f41U.aexj38RTdLk4ARCiHql2',
    // __v: 2,
    // children:
    //  [ { _id: 5901014ce0706c0a621f1462,
    //      fname: 'b',
    //      lname: 'b',
    //      email: 'b',
    //      points: 0,
    //      passwordHash: '$2a$08$sj0YvhfbThKxuPGl.WVND.i5f8qoZcCUzuV/Ql4elgTUdk9oqwtKW',
    //      parent: 5901013ee0706c0a621f1461,
    //      __v: 0,
    //      children: [] },
    //    { _id: 59010152e0706c0a621f1463,
    //      fname: 'c',
    //      lname: 'c',
    //      email: 'c',
    //      points: 0,
    //      passwordHash: '$2a$08$Ae9sdESnFkkcS0HqM6Ex1eBD5Ngm/we4QTTgad1moqho5pKlz4EAW',
    //      parent: 5901013ee0706c0a621f1461,
    //      __v: 0,
    //      children: [] } ] }

    // [ children ]
    // attach depth to each child
    // move first child to queue
    // grab all children from that child
    // attach depth + 1 to all children

    User.find({ fname: "a" })
      .populate({
        path: "children",
        populate: { path: "children" }
      })
      .then(user => {
        console.log(user);
      });

    // let children = user.children;
    // children = children.map(child => {
    //   child.depth = 1;
    //   return child;
    // });
    // console.log(user);
    // let stack = children;
    // while (stack.length) {
    //   let current = stack.shift();
    //   let currentChildren = (await current.populate("children")).children;
    //   currentChildren = currentChildren.map(
    //     child => child.depth = current.depth + 1
    //   );
    //   console.log("this is the current value", current);
    //
    //   stack = currentChildren.concat(stack);
    // }
    // console.log(user);

    res.render("index", { user });
  });

  router.get("/login", loggedOutOnly, (req, res) => {
    res.render("login");
  });

  router.get("/register", loggedOutOnly, (req, res) => {
    res.render("register");
  });

  router.get("/logout", loggedInOnly, (req, res) => {
    req.logout();
    res.redirect("/login");
  });

  router.post(
    "/login",
    loggedOutOnly,
    passport.authenticate("local", {
      successRedirect: "/",
      failureRedirect: "/login"
    })
  );

  router.post("/register", loggedOutOnly, (req, res, next) => {
    const { fname, lname, email, password } = req.body;
    const user = new User({
      fname: fname,
      lname: lname,
      email: email,
      points: 0,
      password: password
    });
    user
      .save()
      .then(user => {
        req.login(user, err => {
          if (err) throw err;
          res.redirect("/");
        });
      })
      .catch(next);
  });

  return router;
};
