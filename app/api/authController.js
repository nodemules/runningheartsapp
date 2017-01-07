{
  module.exports = function() {

    var express = require('express'),
      api = express.Router(),
      passport = require('passport'),
      authService = require('./authService'),
      roleService = require('./roleService')();

    api.get('/permission/add/:roleId/:permissionId', roleService.addPermissionToRole, (req, res) => {
      res.send({
        message: 'Permission inserted'
      })
    })

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

    api.post('/permission', (req, res, next) => authService().checkPermissions(req, res, next, authService().getPermissions(req.body.permissions)), (req, res) => {
      res.send({
        message: 'Permission validated'
      })
    })

    return api;
  }
}
