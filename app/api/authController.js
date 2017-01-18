{
  module.exports = function() {

    var express = require('express'),
      api = express.Router(),
      passport = require('passport'),
      authService = require('./authService')(),
      roleService = require('./roleService')(),
      Permissions = require('../enum/permissions');

    api.get('/permissions/add/all/:roleId',
      (req, res, next) => authService.checkPermissions(req, res, next, [Permissions.ADD_ALL_PERMISSIONS]),
      roleService.addAllPermissionsToRole, (req, res) => {
        res.send({
          message: `All permissions added to Role [${res.locals.role.name}]`
        })
      })

    api.get('/permissions/add/:roleId/:permissionId',
      (req, res, next) => authService.checkPermissions(req, res, next, [Permissions.ADD_PERMISSION]),
      roleService.addPermissionToRole, (req, res) => {
        let permissionId = parseInt(req.params.permissionId);
        res.send({
          message: `Permission [${Permissions.get(permissionId).key}] inserted into Role [${res.locals.role.name}]`
        })
      })

    api.get('/permissions', authService.auth, (req, res, next) => {
      var permissions = {},
        p = req.session.permissions;

      for (let i in p) {
        permissions[p[i].key] = true;
      }

      res.send(permissions);

    })

    api.get('/', authService.auth, (req, res) => {
      res.send({
        message: `User [${res.req.user.username}] is authenticated`
      })
    })

    api.post('/login', passport.authenticate('local'), authService.setPermissions, (req, res) => {
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

    api.post('/permission', (req, res, next) => authService.checkPermissions(req, res, next, authService.getPermissions(req.body.permissions)), (req, res) => {
      res.send({
        message: 'Permission validated'
      })
    })

    return api;
  }
}
