// global angular
(function (angular) {
  
  angular.module(APP_NAME).factory('gamesService', gamesService);

  gamesService.$inject = [ '$resource' ];

  function gamesService($resource) {

    var basePath = '/api/games'
    
    var service = {
      api : api
    }

    return service;

    /////////////////////

    function api(id) {
      return $resource(basePath + '/:id', {
        id : id
      }, {
        'create' : {
          method : 'POST'
        }
      });
    }

  }

})(angular);