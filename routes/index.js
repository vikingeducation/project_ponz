const router = require("express").Router();
const { users } = require("../controllers");

router.get("/", (req, res) => {
	console.log("loop again?");
	// console.log("req.session", req.session);
	if (req.user) {
		console.log("inside redirect here???");
		return res.redirect("/ponzvert");
	}

	return res.render("landing/index");
});

module.exports = router;
