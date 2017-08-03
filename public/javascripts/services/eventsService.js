{
  /* global angular, APP_NAME */

  angular.module(APP_NAME).factory('eventsService', eventsService);

  eventsService.$inject = ['$resource', 'entityService', 'Entities'];

  function eventsService($resource, entityService, Entities) {

    const basePath = '/api/events';

    var service = {
      api: api
    }

    return service;

    /////////////////////

    function api(id) {
      return $resource(basePath + '/:id/:action', {
        id
      }, {
        'save': {
          method: 'POST',
          transformRequest: function(data) {
            entityService.changeEntity(Entities.EVENT);
            if (data.$$error) {
              delete data.$$error;
            }
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
        },
        'season': {
          method: 'GET',
          url: basePath + '/season/:id',
          isArray: true
        }
      });
    }

  }

}
