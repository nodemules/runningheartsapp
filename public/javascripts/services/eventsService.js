// global angular
(function (angular) {
  
  angular.module(APP_NAME).factory('eventsService', eventsService);

  eventsService.$inject = [ '$resource' ];

  function eventsService($resource) {

    var basePath = '/api/events'
    
    var service = {
      api : api
    }

    return service;

    /////////////////////

    function api(id) {
      return $resource(basePath + '/:id', {
        id : id
      });
    }

  }

})(angular);