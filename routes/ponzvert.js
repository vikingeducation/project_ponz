const router = require("express").Router();
const { isLoggedIn } = require("../middleware");

router.get("/", isLoggedIn, (req, res) => {
	return res.render("ponzvert/index", { user: req.user });
});

router.get("/:shortid", (req, res) => {
	req.session.shortid = req.params.shortid;
	return res.redirect("/");
})

module.exports = router;
