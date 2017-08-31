{
  function exports() {

    const LOG = require('../../config/logging').getLogger();

    var Role = require('../models/role');
    var Permissions = require('../enum/permissions');

    const errorService = require('./advice/errorService');

    var service = {
      getPermissionsForRole,
      addPermissionToRole,
      addAllPermissionsToRole
    };

    function getPermissionsForRole(roleId, cb) {
      Role.find({
        roleId: roleId
      }, (err, roles) => {
        if (err) {
          return LOG.error(err);
        }
        var role = roles[0];
        cb(role ? role.permissions : []);
      });
    }

    function addPermissionToRole(req, res, next) {
      var permission = Permissions.get(parseInt(req.params.permissionId));

      Role.findOneAndUpdate({
        roleId: req.params.roleId
      }, {
        $addToSet: {
          'permissions': {
            key: permission.key,
            value: permission.value
          }
        }
      }, {
        upsert: true
      }, function(err, data) {
        if (err) {
          LOG.error(err);
          return errorService.handleError(res, err);
        }

        res.locals.role = data;
        next();
      });

    }

    function addAllPermissionsToRole(req, res, next) {
      var permissions = [];
      Permissions.enums.forEach((permission) => {
        let p = {
          key: permission.key,
          value: permission.value
        };
        permissions.push(p);
      });

      Role.findOneAndUpdate({
        roleId: req.params.roleId
      }, {
        $addToSet: {
          permissions: {
            $each: permissions
          }
        }
      }, {
        upsert: true
      }, function(err, data) {
        if (err) {
          LOG.error(err);
          return errorService.handleError(res, err);
        }

        res.locals.role = data;
        next();
      });

    }

    return service;
  }

  module.exports = exports;
}
