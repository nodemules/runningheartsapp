// server.js

// set up ======================================================================
// get all the tools we need
var express    = require('express');
var path       = require('path');
var app        = express();
var port       = process.env.RHP_PORT || 8080;
var mongoose   = require('mongoose');
var morgan     = require('morgan');
var bodyParser = require('body-parser');

var session       = require('express-session');
var passport      = require('passport');
var LocalStrategy = require('passport-local'), Strategy;
var flash         = require('connect-flash');
var cookieParser  = require('cookie-parser');

var api = require('./app/api/main');
var configDB = require('./config/database.js');

// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));

//authentication
require('./config/passport')(passport); 
app.use(cookieParser()); // read cookies (needed for auth)
app.use(flash());
app.use(session({
  secret: 'wouldyoupleasestopshiningthatthinginmyeyesnow', //I'm sure we need to pass this in from some ignored file for production since it's on git...
  saveUnitialized: true,
  resave: true
}));
app.use(passport.initialize());
app.use(passport.session());

app.set('view engine', 'ejs'); // set up ejs for templating
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', api);

// routes ======================================================================
require('./app/routes.js')(app);

// launch ======================================================================
app.listen(port);
console.log('Running Hearts App Listening On... ' + port);
