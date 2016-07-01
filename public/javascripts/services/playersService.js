// global angular
(function (angular) {
  
  angular.module(APP_NAME).factory('playersService', playersService);

  playersService.$inject = [ '$resource' ];

  function playersService($resource) {

    var basePath = '/api/players'
    
    var service = {
      api : api
    }

    return service;

    /////////////////////

    function api(id) {
      return $resource(basePath + '/:id', {
        id : id
      }, {
        'findBy' : { 
          method : 'PUT',
          isArray : true
         }
      });
    }

  }

})(angular);