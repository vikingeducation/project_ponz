const express = require('express');
const app = express();


// Environment Variables
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}


// Body Parser
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));


// Public
app.use(express.static(`${__dirname}/public`));


// Logging
const logger = require('morgan');
const morganToolkit = require('morgan-toolkit')(logger);

app.use(morganToolkit());


// Cookies
var cookieSession = require('cookie-session');
const cookieParser = require('cookie-parser');

app.use(cookieParser());
app.use(cookieSession({
  name: 'session',
  keys: ['asdf1234567890qwer']
}));

// Flash Messages
const flash = require('express-flash-messages');
app.use(flash());


// Database
const mongoose = require('mongoose');
app.use((req, res, next) => {
  if (mongoose.connection.readyState) {
    next();
  } else {
    require('./mongo')().then(() => next());
  }
});


// Sessions
const expressSession = require("express-session");
app.use(
  expressSession({
    secret: process.env.SECRET,
    saveUninitialized: false,
    resave: false
  })
);


const passport = require("passport");
app.use(passport.initialize());
app.use(passport.session());

require('./lib/passport_strategy');

const { setCurrentUser } = require('./services/session');
app.use(setCurrentUser);


// Routes
const sessions = require('./routers/sessions');
const home = require('./routers/index');
const register = require('./routers/register');

app.use('/ponzvert', register);
app.use('/', sessions);
app.use('/home', home);


// Template Engine
const expressHandlebars = require('express-handlebars');
const helpers = require('./helpers');

const hbs = expressHandlebars.create({
  helpers: helpers,
  partialsDir: 'views/',
  defaultLayout: 'application',
  extname: '.hbs'
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');


// Server
var port = process.env.PORT ||
  process.argv[2] ||
  3000;
var host = 'localhost';

var args;
if (process.env.NODE_ENV === 'production') {
  args = [port];
} else {
  args = [port, host];
}

args.push(() => {
  console.log(`Listening: http://${ host }:${ port }`);
});

app.listen.apply(app, args);
