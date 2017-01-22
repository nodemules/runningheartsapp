{
  /* global angular, APP_NAME */
  angular.module(APP_NAME).factory('authApiService', authApiService);

  authApiService.$inject = ['$resource', 'authService', 'permissionsService'];

  function authApiService($resource, authService, permissionsService) {

    var basePath = '/api/auth';

    var service = {
      api
    }

    return service;

    /////////////////////

    function api(id) {
      return $resource(basePath + '/:action', {
        id: id
      }, {
        'login': {
          method: 'POST',
          params: {
            action: 'login'
          },
          transformResponse: (data, headers, status) => {
            authService.authenticate(status === 200);
            if (authService.isAuth()) {
              permissionsService.setPermissions();
            }
            return angular.fromJson(data);
          }
        },
        'logout': {
          method: 'GET',
          params: {
            action: 'logout'
          },
          transformResponse: (data) => {
            authService.authenticate(false);
            permissionsService.clearPermissions();
            return angular.fromJson(data);
          }
        }
      });
    }

  }

}
