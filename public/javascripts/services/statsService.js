// global angular
(function(angular) {
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
      return $resource(basePath + '/:action/:id/:action2/:action3', {
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

})(angular);
