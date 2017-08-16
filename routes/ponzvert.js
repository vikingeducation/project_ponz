const router = require("express").Router();
const { isLoggedIn } = require("../middleware");
const { User } = require("../models");

router.get("/", isLoggedIn, async (req, res) => {
	try {
		const user = await User.findById(req.user._id).populate('children')
		console.log("userInfo ", user)
		return res.render("ponzvert/index", { user });
	} catch(err) {
		console.error(err);
		return res.json({
			confirmation: "fail",
			message: err.message
		});
	}
});

router.get("/:shortid", (req, res) => {
	req.session.shortid = req.params.shortid;

	return res.redirect("/");
})

module.exports = router;
