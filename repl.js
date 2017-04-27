const mongoose = require('mongoose');
const repl = require('repl').start({});
const User = require('./models/User');


require('./mongo')().then(() => {
  repl.context.User = User;
  repl.context.lg = (data) => console.log(data);
});
