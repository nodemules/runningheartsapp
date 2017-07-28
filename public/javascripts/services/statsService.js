{
  /* global angular, APP_NAME */
  angular.module(APP_NAME).factory('statsService', statsService);

  statsService.$inject = ['$resource'];

  function statsService($resource) {
    var basePath = '/api/stats';

    var service = {
      api: api
    }

    return service;

    /////////////////////

    function api(id, id2) {
      return $resource(basePath + '/:action/:id/:action2/:id2/:action3', {
        id: id,
        id2: id2
      }, {
        'player': {
          method: 'get',
          params: {
            action: 'players'
          }
        },
        'playerSeason': {
          method: 'get',
          params: {
            action: 'players',
            action2: 'season'
          }
        },
        'players': {
          method: 'get',
          params: {
            action: 'players'
          },
          isArray: true
        },
        'winners': {
          method: 'get',
          params: {
            action: 'winners'
          },
          isArray: true
        },
        'seasons': {
          method: 'get',
          params: {
            action: 'seasons',
            action2: 'players'
          },
          isArray: true
        },
        'seasonWinners': {
          method: 'get',
          params: {
            action: 'seasons',
            actions2: 'winners'
          },
          isArray: true
        },
        'currentSeasonWinners': {
          method: 'get',
          params: {
            action: 'seasons',
            action2: 'winners',
            action3: 'current'
          },
          isArray: true
        }
      });
    }

  }

}
