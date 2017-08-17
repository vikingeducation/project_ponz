const router = require("express").Router();
const { users } = require("../controllers");

router.get("/", (req, res) => {
	if (req.isAuthenticated()) {
		return res.redirect("/ponzvert");
	}

	return res.render("landing/index");
});

module.exports = router;
