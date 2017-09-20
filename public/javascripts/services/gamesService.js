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
    };

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
            var d = angular.fromJson(data);
            d.$$saving = false;
            return d;
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
            var d = angular.fromJson(data);
            d.$$saving = false;
            return d;
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
