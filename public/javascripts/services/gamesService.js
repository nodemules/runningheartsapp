{
  /* global angular, APP_NAME */
  angular
    .module(APP_NAME)
    .factory('gamesService', gamesService);

  gamesService.$inject = ['$resource', 'entityService', 'Entities'];

  function gamesService($resource, entityService, Entities) {

    const basePath = '/api/games';

    var service = {
      api: api
    }

    return service;

    /////////////////////

    function api(id) {
      return $resource(basePath + '/:id/:action', {
        id: id
      }, {
        'create': {
          method: 'POST',
          transformRequest: function(data) {
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
        'save': {
          method: 'POST',
          params: {
            id: null
          },
          transformRequest: function(data) {
            entityService.changeEntity(Entities.GAME);
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

}
