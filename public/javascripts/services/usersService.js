// global angular
(function (angular) {
  
  angular.module(APP_NAME).factory('usersService', usersService);

  usersService.$inject = [ '$resource' ];

  function usersService($resource) {

    var basePath = '/api/users'
    
    var service = {
      api : api,
      type : type
    }

    return service;

    /////////////////////

    function apix(id) {
      return $resource(basePath + '/:action/:id', {
        id : id
      }, {
        'type' : {
          method : 'GET',
          params : {
            action : 'type'
          }
        }
      });
    }

    function api(id) {
      return $resource(basePath + '/:id', {
        id : id
      });
    }

    function type(id) {
      return $resource(basePath + '/type/:id', {
        id : id
      });
    }

  }

})(angular);