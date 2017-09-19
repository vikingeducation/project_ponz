const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { User } = require("./../models");

router.get("/", (req, res) => {
	res.render("shop", { user: req.user });
});

router.post("/", (req, res) => {
	if (req.user.ponzBucks > 500) {
		req.user.ponzBucks -= 500;
		User.findByIdAndUpdate(req.user.id, {
			ponzBucks: req.user.ponzBucks
		}).then(() => {
			return res.render("/");
		});
	} else {
		req.flash("warning", `You do not have enough PonzBucks to buy that :C`);
		res.render("shop");
	}
});

module.exports = router;
