const router = require("express").Router();
const { users } = require("../controllers");

router.get("/", (req, res) => {
	res.render("landing/index");
});

module.exports = router;
