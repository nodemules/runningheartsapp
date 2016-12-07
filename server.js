// server.js

// set up ======================================================================
// get all the tools we need
var express = require('express');
var path = require('path');
var app = express();
var port = process.env.RHP_PORT || 8080;
var mongoose = require('mongoose');
var morgan = require('morgan');
var bodyParser = require('body-parser');

var session = require('express-session');
var passport = require('passport');
var flash = require('connect-flash');
var cookieParser = require('cookie-parser');

var api = require('./app/api/main');
var configuration = require('./config/configuration.js');

// configuration ===============================================================
require('./config/passport')(passport);
mongoose.connect(configuration.dburl); // connect to our configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({
  extended: true
}));

app.set('view engine', 'ejs'); // set up ejs for templating
app.use(express.static(path.join(__dirname, 'public')));

//authentication
app.use(cookieParser(configuration.secret)); // read cookies (needed for auth)
app.use(flash());
app.use(session({
  cookie: {
    httpOnly: true,
    maxAge: 86400
  },
  secret: configuration.secret,
  store: new(require('express-sessions'))({
    storage: 'mongodb',
    instance: mongoose, // optional
    host: configuration.db.host, // optional
    port: configuration.db.port, // optional
    db: configuration.db.name, // optional
    collection: 'sessions', // optional
    expire: 86400 // optional
  })
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/api', api);

// routes ======================================================================
require('./app/routes.js')(app);

// launch ======================================================================
app.listen(port);
console.log('Running Hearts App Listening On... ' + port);
