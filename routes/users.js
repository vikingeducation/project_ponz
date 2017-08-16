var express = require("express");
var router = express.Router();

/* GET users listing. */
router.get("/", function(req, res, next) {
  res.send("respond with a resource");
});
router.get("/signup", (req, res) => {
  return res.render("signup");
});
router.post("/signup", (req, res) => {
  //if error
});

module.exports = router;
