const express = require('express');
const router = express.Router();
const passport = require('passport');
const { makeTreeGraphStructure } = require('../helpers');
const { User } = require('../models');

/* GET home page. */
router.get('/', async function(req, res, next) {
	// working
	const user = await User.findRecursive({ _id: req.user._id });

	if (!user) {
		return next(new Error('User not found...'));
	}
	const treeGraph = res.render('index', {
		user: user,
		treeGraph: JSON.stringify(makeTreeGraphStructure(user))
	});
});

router.get('/login', (req, res) => {
	return res.render('login');
});

router.post(
	'/login',
	passport.authenticate('local', {
		// successRedirect: '/',
		failureRedirect: '/login',
		failureFlash: true
	}),
	(req, res) => {
		res.cookie('userId', req.user.id);
		res.redirect('/');
	}
);

router.get('/logout', (req, res) => {
	req.logout();
	res.redirect('/login');
});
module.exports = router;
