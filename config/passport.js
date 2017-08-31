{

  module.exports = function(passport) {

    const LOG = require('./logging').getLogger();

    var LocalStrategy = require('passport-local').Strategy;
    var mongoose = require('mongoose');
    var User = mongoose.model('User');

    passport.serializeUser(function(user, done) {
      done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
      User.findById(id, function(err, user) {
        done(err, user);
      });
    });

    passport.use('local', new LocalStrategy({
      usernameField: 'username',
      passwordField: 'password',
      passReqToCallback: true
    },
      function(req, username, password, done) {

        User.findOne({
          username: username.toLowerCase()
        }, function(err, user) {

          if (err)
            return done(err);
          if (!user) {
            LOG.info(`No user found for username: [${username}]`);
            return done(null, false); // no user
          }

          if (!user.validPassword(password)) {
            LOG.info(`FAILED LOGIN ATTEMPT! INVALID PASS FOR USER: [${user.username}]`);
            return done(null, false); // password wrong
          }

          LOG.info(`SUCCESSFUL LOGIN OF USER: [${user.username}]`);
          return done(null, user);
        });

      }));

  };
}
