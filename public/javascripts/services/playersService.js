{
  // global angular, APP_NAME

  angular.module(APP_NAME).factory('playersService', playersService);

  playersService.$inject = ['$resource', 'entityService', 'Entities'];

  function playersService($resource, entityService, Entities) {

    const basePath = '/api/players';

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
            entityService.changeEntity(Entities.PLAYER);
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
        },
        'shoutOut': {
          method: 'PUT',
          params: {
            action: 'shoutOut'
          }
        },
        'count': {
          method: 'GET',
          params: {
            action: 'count'
          }
        },
        'validate': {
          method: 'POST',
          params: {
            action: 'validate'
          }
        }
      });
    }

  }

}
