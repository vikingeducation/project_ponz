const router = require("express").Router();
const { users } = require("../controllers");

router.get("/", (req, res) => {
	console.log("req.session", req.session);
	if(req.isAuthenticated()) {
		return res.redirect("/ponzvert");
	}
	 return res.render("landing/index");
});

module.exports = router;
