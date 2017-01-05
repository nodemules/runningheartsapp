{
  function exports() {
    var Permissions = require('../enum/permissions');
    var RoleService = require('./roleService')();
    var service = {
      auth,
      setPermissions,
      checkPermissions
    }

    const PERMISSIONS_TTL_MINUTES = 5;
    const PERMISSIONS_TTL = PERMISSIONS_TTL_MINUTES * 60 * 1000;

    function auth(req, res, next) {
      console.log(`Checking if user is logged in...`);
      console.log(req.sessionID ? `Session found for ${req.sessionID}` : `No session found.`);
      console.log(`Session ${req.isAuthenticated() ? `is` : `is not`} authenticated`);

      if (!req.isAuthenticated()) {
        res.send(401, {
          message: `No valid user session`,
          code: `NO_USER_FOUND`
        });
      } else
        next();
    };

    function setPermissions(req, res, next) {
      let now = new Date();
      console.log(req.session);

      if (!req.session.permissions || (req.session.permissionExpires && (new Date(req.session.permissionExpires).getTime() < now.getTime()))) {
        console.log(`Setting permissions for [${req.user.username}]`)
        RoleService.getPermissionsForRole(req.user.roleId, (permissions) => {
          req.session.permissions = permissions;
          let then = now.getTime() + PERMISSIONS_TTL;
          console.log(then);
          req.session.permissionExpires = new Date(then);
          console.log(req.session.permissionExpires);
          console.log(`${req.session.permissions.length} permissions found for [${req.user.username}],
            they will expire in ${new Date(req.session.permissionExpires).getTime() - now.getTime()}`)
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
    function arrayContainsArray (superset, subset) {
      return subset.every(function (value) {
        return (superset.indexOf(value) >= 0);
      });
    }

    function checkPermissions(req, res, next, requiredPermissions) {
      auth(req, res, () => {
        console.log(`Checking permissions for ${req.user.username}`)
        let permissions = getPermissions(req.session.permissions);
        if (arrayContainsArray(permissions, requiredPermissions)) {
          console.log(`${requiredPermissions.length} valid permissions for ${req.user.username}`)
          next();
        } else {
          console.log(`Invalid permissions for ${req.user.username}`)
          res.send(401, {
            message: `Invalid permissions`,
            code: `PERMISSIONS_INVALID`
          })
        }
      });
    }

    function getPermissions(permissionsMap) {
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
