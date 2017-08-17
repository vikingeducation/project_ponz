const router = require("express").Router();
const { users } = require("../controllers");

router.get("/", (req, res) => {
	if (req.isAuthenticated()) {
		return res.redirect("/ponzvert");
	}
	let shortid;
	let message;
	shortid = req.session.shortid;
	message = req.session.message;
	console.log(message);
	console.log("flashMessage: ", req.flash("message"));
	return res.render("landing/index", {
		shortid,
		message: req.flash("message")
	});
});

router.get("/clear", (req, res) => {
	req.session.shortid = null;
	res.redirect("/");
});

module.exports = router;
