const router = require("express").Router();
const { isLoggedIn } = require("../middleware");
const { User } = require("../models");
const { users } = require("../controllers");

router.get("/", isLoggedIn, users.viewPonzvert);

router.get("/:shortid", (req, res) => {
	req.session.shortid = req.params.shortid;
	return res.redirect("/");
});

module.exports = router;
