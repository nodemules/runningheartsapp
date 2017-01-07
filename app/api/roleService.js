{
  function exports() {
    var Role = require('../models/role');
    var Permissions = require('../enum/permissions');
    var service = {
      getPermissionsForRole,
      addPermissionToRole
    }

    function getPermissionsForRole(roleId, cb) {
      Role.find({
        roleId: roleId
      }, (err, roles) => {
        if (err)
          return console.error(err);
        var role = roles[0];
        cb(role.permissions);
      })
    }

    function addPermissionToRole(req, res, next) {
      var permission = Permissions.get(parseInt(req.params.permissionId));

      Role.update({
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
        if (err)
          console.log(err);
        console.log(data);
        next();
      });

    }

    return service;
  }

  module.exports = exports;
}
