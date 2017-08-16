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
middleWare.database.exit = async function() {
	if (mongoose.connection.readyState) {
		await mongoose.disconnect();
	}
};

middleWare.login.authenticatedOnly = (req, res, next) => {
	return next(); // TODO: REMOVE THIS
	if (req.path === '/login' && req.user) {
		res.redirect('/');
	} else if (req.path !== '/login' && !req.user) {
		res.redirect('/login');
	} else {
		next();
	}
};

module.exports = middleWare;
