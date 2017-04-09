// global angular
(function(angular) {

  angular.module(APP_NAME).factory('eventsService', eventsService);

  eventsService.$inject = ['$resource'];

  function eventsService($resource) {

    var basePath = '/api/events'

    var service = {
      api: api
    }

    return service;

    /////////////////////

    function api(id) {
      return $resource(basePath + '/:id/:action', {
        id: id
      }, {
        'save': {
          method: 'POST',
          transformRequest: function(data) {
            data.$$saving = true;
            return angular.toJson(data);
          },
          transformResponse: function(data) {
            data.$$saving = false;
            return angular.fromJson(data);
          }
        },
        'count': {
          method: 'GET',
          params: {
            action: 'count'
          }
        },
        'byDate': {
          method: 'GET',
          params: {
            action: 'date'
          },
          isArray: true
        }
      });
    }

  }

})(angular);
