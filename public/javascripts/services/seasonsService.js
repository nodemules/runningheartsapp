// global angular, APP_NAME
{

  angular.module(APP_NAME).factory('seasonsService', seasonsService);

  seasonsService.$inject = ['$resource'];

  function seasonsService($resource) {

    const basePath = '/api/seasons'

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
        },
        'byEventDate': {
          method: 'GET',
          url: basePath + '/date/:date'
        }
      });
    }
  }

}
