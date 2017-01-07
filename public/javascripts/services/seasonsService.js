// global angular
(function(angular) {

  angular.module(APP_NAME).factory('seasonsService', seasonsService);

  seasonsService.$inject = ['$resource'];

  function seasonsService($resource) {

    var basePath = '/api/seasons'

    var service = {
      api: api
    }

    return service;

    /////////////////////

    function api(id) {
      return $resource(basePath + '/:id/:action', {
        id: id
      }, {
        'findBy': {
          method: 'PUT',
          isArray: true
        },
        'notIn': {
          method: 'PUT',
          params: {
            action: 'notIn'
          },
          isArray: true
        }
      });
    }

  }

})(angular);
