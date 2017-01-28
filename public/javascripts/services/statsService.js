{
  angular.module(APP_NAME).factory('statsService', statsService);

  statsService.$inject = ['$resource'];

  function statsService($resource) {
    var basePath = '/api/stats';

    var service = {
      api: api
    }

    return service;

    /////////////////////

    function api(id) {
      return $resource(basePath + '/:action/:id', {
        id: id
      }, {
        'player': {
          method: 'get',
          params: {
            action: 'players'
          }
        },
        'players': {
          method: 'get',
          params: {
            action: 'players'
          },
          isArray: true
        },
        'seasons': {
          method: 'get',
          params: {
            action: 'seasonalPlayers'
          },
          isArray: true
        }
      });
    }

  }

}
