const router = require("express").Router();
const { users } = require("../controllers");
const io = require("../io").getIO();

router.get("/", (req, res) => {
	// if (req.session.error === "user_exists") {
	// 	io.emit("user_exists");
	// 	req.session.error = null;
	// }

	if (req.isAuthenticated()) {
		return res.redirect("/ponzvert");
	}

	let shortid = req.session.shortid;

	return res.render("landing/index", {
		shortid
	});
});

router.get("/clear", (req, res) => {
	req.session.shortid = null;
	res.redirect("/");
});

// router.get("/scheme", (req, res) => {
// 	res.render("scheme/index");
// });

module.exports = router;
