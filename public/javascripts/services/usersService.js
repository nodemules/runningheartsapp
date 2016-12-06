// global angular
(function (angular) {

  angular.module(APP_NAME).factory('usersService', usersService);

  usersService.$inject = [ '$resource' ];

  function usersService($resource) {

    var basePath = '/api/users'

    var service = {
      api : api
    }

    return service;

    /////////////////////

    function api(id) {
      return $resource(basePath + '/:action', {
        id : id
      }, {
        'login' : {
          method : 'POST',
          params : {
            action: 'login'
          }
         }
      });
    }

  }

})(angular);
