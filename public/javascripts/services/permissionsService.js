{
  /* global angular, APP_NAME */
  angular.module(APP_NAME).factory('permissionsService', permissionsService);

  permissionsService.$inject = ['$resource', '$timeout', 'authService'];

  function permissionsService($resource, $timeout, authService) {

    var basePath = '/api/auth/permissions';

    var permissions = {};

    var service = {
      getPermissions,
      setPermissions,
      checkPermissions
    }

    setPermissions();

    return service;

    //////////////////

    function api(id) {
      return $resource(basePath, {
        id
      })
    }

    function getPermissions(cb) {
      var interval = 250;
      if (!permissions || !Object.keys(permissions).length) {
        $timeout(() => {
          getPermissions(cb);

        }, interval)

      } else if (cb && typeof cb === 'function') {
        return cb(permissions);
      }

    }

    function setPermissions() {
      api().get((data) => {
        permissions = data;
      })
    }

    function checkPermissions() {

    }

  }
}
