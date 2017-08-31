{
  function exports() {

    const LOG = require('../../config/logging').getLogger();

    var Permissions = require('../enum/permissions');
    var RoleService = require('./roleService')();
    var service = {
      auth,
      isAuth,
      setPermissions,
      checkPermissions,
      getPermissions
    };

    const PERMISSIONS_TTL_MINUTES = 5;
    const PERMISSIONS_TTL = PERMISSIONS_TTL_MINUTES * 60 * 1000;

    function auth(req, res, next) {
      LOG.info('Checking if user is logged in...');
      LOG.info(req.sessionID ? `Session found for ${req.sessionID}` : 'No session found.');
      LOG.info(`Session ${req.isAuthenticated() ? 'is' : 'is not'} authenticated`);

      if (!req.isAuthenticated()) {
        res.send(401, {
          message: 'No valid user session',
          code: 'NO_USER_FOUND'
        });
      } else
        next();
    }

    function isAuth(req) {
      return req.isAuthenticated();
    }

    function setPermissions(req, res, next) {
      let now = new Date();

      if (!req.session.permissions || (req.session.permissionExpires &&
          (new Date(req.session.permissionExpires).getTime() < now.getTime()))) {
        LOG.info(`Setting permissions for [${req.user.username}]`);
        RoleService.getPermissionsForRole(req.user.roleId, (permissions) => {
          req.session.permissions = permissions;
          let then = now.getTime() + PERMISSIONS_TTL;
          req.session.permissionExpires = new Date(then);
          LOG.info(
            `${req.session.permissions.length} permissions found for [${req.user.username}],
            they will expire in ${new Date(req.session.permissionExpires).getTime() - now.getTime()}`
          );
          next();
        });
      } else {
        next();
      }
    }

    /**
     * Returns TRUE if the first specified array contains all elements
     * from the second one. FALSE otherwise.
     *
     * @param {array} superset
     * @param {array} subset
     *
     * @returns {boolean}
     */
    function arrayContainsArray(superset, subset) {
      return subset.every(function(value) {
        return (superset.indexOf(value) >= 0);
      });
    }

    function checkPermissions(req, res, next, requiredPermissions) {
      LOG.info(`Checking if user has following permissions: ${requiredPermissions}`);
      auth(req, res, () => {
        LOG.info(`Checking permissions for ${req.user.username}`);
        let permissions = getPermissionsFromMap(req.session.permissions);
        if (arrayContainsArray(permissions, requiredPermissions)) {
          LOG.info(`${requiredPermissions.length} valid permissions for ${req.user.username}`);
          next();
        } else {
          LOG.info(`Invalid permissions for ${req.user.username}`);
          res.send(401, {
            message: 'Invalid permissions',
            code: 'PERMISSIONS_INVALID'
          });
        }
      });
    }

    function getPermissions(permissions) {
      var p = [];
      for (var i in permissions) {
        p.push(Permissions.get(permissions[i]));
      }
      return p;
    }

    function getPermissionsFromMap(permissionsMap) {
      var permissions = [];
      for (var i in permissionsMap) {
        permissions.push(Permissions.get(permissionsMap[i].value));
      }
      return permissions;
    }

    return service;
  }

  module.exports = exports;
}
