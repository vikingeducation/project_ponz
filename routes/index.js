const express = require('express');
const router = express.Router();
const passport = require('passport');
const { User } = require('../models');

/* GET home page. */
router.get('/', async function(req, res, next) {
	const user = await User.findById(req.user._id);
	if (!user) {
		return next(new Error('User not found...'));
	}

	res.render('index', { user });
});

router.get('/login', (req, res) => {
	return res.render('login');
});

router.post(
	'/login',
	passport.authenticate('local', {
		successRedirect: '/',
		failureRedirect: '/login',
		failureFlash: true
	})
);

router.get('/logout', (req, res) => {
	req.logout();
	res.redirect('/login');
});
module.exports = router;
