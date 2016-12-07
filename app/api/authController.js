{
  module.exports = function() {

    var express = require('express'),
      api = express.Router(),
      passport = require('passport'),
      authService = require('./authService');

    api.get('/', authService().auth, (req, res) => {
      res.send({
        message: `User [${res.req.user.username}] is authenticated`
      })
    })

    api.post('/login', passport.authenticate('local'), authService().setPermissions, (req, res) => {
      res.send({
        message: `User [${res.req.user.username}] has been logged in`
      })
    })

    api.get('/logout', (req, res) => {
      let sessionUser = req.user;
      console.log(`Logging out [${sessionUser.username}]`)
      req.logout();
      res.send({
        message: `User [${sessionUser.username}] has been logged out`
      });
    })

    return api;
  }
}
