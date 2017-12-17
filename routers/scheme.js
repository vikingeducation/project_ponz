var express = require("express");
var router = express.Router();

// scheme view
router.get("/scheme", (req, res) => {
	res.render("scheme");
});

module.exports = router;