// global angular, APP_NAME
{

  angular.module(APP_NAME).factory('venuesService', venuesService);

  venuesService.$inject = ['$resource', 'entityService', 'Entities'];

  function venuesService($resource, entityService, Entities) {

    const basePath = '/api/venues';

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
            entityService.changeEntity(Entities.VENUE);
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
        }
      });
    }

  }

}
