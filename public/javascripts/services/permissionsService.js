{
  /* global angular, APP_NAME */
  angular.module(APP_NAME).factory('permissionsService', permissionsService);

  permissionsService.$inject = ['$resource', '$timeout', 'authService'];

  function permissionsService($resource, $timeout, authService) {

    var basePath, permissions;

    basePath = '/api/auth/permissions';

    permissions = {};

    var service = {
      getPermissions,
      setPermissions,
      checkPermissions,
      clearPermissions
    }

    setPermissions();

    return service;

    //////////////////

    function api(id) {
      return $resource(basePath, {
        id
      }, {
        'get': {
          method: 'GET',
          transformResponse: (data, headers, status) => {
            authService.authenticate((status === 200));
            return angular.fromJson(data);
          }
        }
      })
    }

    function getPermissionsFromMemory(PERMISSIONS_ATTEMPT_COUNT, cb) {
      var interval, AUTHENTICATION_STATUS, PERMISSIONS_MAX_ATTEMPTS, PERMISSIONS_INVALID, PERMISSIONS_POPULATED;

      interval = 1000;
      PERMISSIONS_MAX_ATTEMPTS = 10;
      AUTHENTICATION_STATUS = (!authService.hasAuthenticated() || (authService.hasAuthenticated() && authService.isAuth()));
      PERMISSIONS_POPULATED = !!Object.keys(permissions).length;
      PERMISSIONS_INVALID = (PERMISSIONS_ATTEMPT_COUNT === PERMISSIONS_MAX_ATTEMPTS);

      PERMISSIONS_ATTEMPT_COUNT++;
      if ((!permissions || !PERMISSIONS_POPULATED) && AUTHENTICATION_STATUS && !PERMISSIONS_INVALID) {
        $timeout(() => {
          getPermissionsFromMemory(PERMISSIONS_ATTEMPT_COUNT, cb);
        }, interval)
      } else if (cb && typeof cb === 'function') {
        return cb(permissions);
      }
    }


    function getPermissions(cb) {
      var PERMISSIONS_ATTEMPT_COUNT = 0;

      return getPermissionsFromMemory(PERMISSIONS_ATTEMPT_COUNT, cb);
    }

    function setPermissions() {
      api().get((data) => {
        permissions = data;
      })
    }

    function checkPermission(requiredPermission) {
      return permissions[requiredPermission];
    }

    function checkPermissions(requiredPermissions) {
      for (let i in requiredPermissions) {
        if (!checkPermission(requiredPermissions[i])) {
          return false;
        }
      }
      return true;
    }

    function clearPermissions() {
      permissions = {};
    }

  }
}
