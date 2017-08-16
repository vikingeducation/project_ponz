var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function(req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/login", (req, res) => {
  let options = {};
  if (req.query.referrerCode) {
    options.referrerCode = req.query.referrerCode;
  }
  return res.render("login", options);
});
router.post("/login", (req, res) => {
  return res.render("login");
});

module.exports = router;
