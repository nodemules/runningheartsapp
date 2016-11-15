// global angular
(function (angular) {

  angular.module(APP_NAME).factory('venuesService', venuesService);

  venuesService.$inject = [ '$resource' ];

  function venuesService($resource) {

    var basePath = '/api/venues'

    var service = {
      api : api
    }

    return service;

    /////////////////////

    function api(id) {
      return $resource(basePath + '/:id/:action', {
        id : id
      }, {
       'count': {
          method: 'GET',
          params: {
            action: 'count'
          }
        }
      });
    }

  }

})(angular);
