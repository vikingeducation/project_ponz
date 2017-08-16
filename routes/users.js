var express = require('express');
var router = express.Router();

const { User } = require('../models');

/* GET users listing. */
router.get('/', function(req, res, next) {
	res.send('respond with a resource');
});
router.get('/signup', (req, res) => {
	return res.render('signup');
});
router.post('/signup', async (req, res) => {
	// Extract form data.
	const formData = {
		username: req.body.username,
		password: req.body.password
	};

	if (req.body._referrerCode) {
		// Get the referring user by the link.
		const referrer = await User.findByReffererCode(req.body._referrerCode);
	}

	let user = await User.create(formData);
	if (!user) {
		throw new Error('Unable to create user');
	}
});

module.exports = router;
