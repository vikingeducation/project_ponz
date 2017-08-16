const router = require("express").Router();
const { isLoggedIn } = require("../middleware");

router.get("/", isLoggedIn, (req, res) => {
	res.send("the main page!");
});

module.exports = router;
