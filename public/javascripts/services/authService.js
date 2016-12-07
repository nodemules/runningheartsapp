{

  angular.module(APP_NAME).factory('authService', authService);

  authService.$inject = ['$resource'];

  function authService($resource) {

    var basePath = '/api/auth'

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
          }
        },
        'logout': {
          method: 'GET',
          params: {
            action: 'logout'
          }
        }
      });
    }

  }

}
