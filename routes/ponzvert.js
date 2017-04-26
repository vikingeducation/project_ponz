const express = require("express");
let router = express.Router();

const User = require("../models/User");

router.get('/:referralId', (req, res) => {
  const referralId = req.params.referralId;
  res.render("ponzvert", { referralId });
});

module.exports = router;
