const passport = require('passport');
const mongoose = require('mongoose');
const mongoConnect = require('./../mongo');

const middleWare = {
	error: {},
	login: {},
	database: {},
	api: {}
};

middleWare.error.notFound = function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
};
middleWare.error.handler = function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
};

middleWare.database.persist = async (req, res, next) => {
	if (!mongoose.connection.readyState) {
		await mongoConnect();
	}
	next();
};
middleWare.database.exit = async (req, res, next) => {
	if (mongoose.connection.readyState) {
		await mongoose.disconnect();
	}
	next();
};

middleWare.login.authenticatedOnly = (req, res, next) => {
	if (req.path[req.path.length - 1] === '/') req.path = req.path.slice(0, -1);
	if (
		['/login', '/users/signup', '/users/signup/'].includes(req.path) ||
		req.isAuthenticated()
	) {
		return next();
	}
	res.redirect('/login');
};

module.exports = middleWare;

/////
