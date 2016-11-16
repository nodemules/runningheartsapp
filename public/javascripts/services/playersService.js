// global angular
(function (angular) {

  angular.module(APP_NAME).factory('playersService', playersService);

  playersService.$inject = [ '$resource' ];

  function playersService($resource) {

    var basePath = '/api/players'

    var service = {
      api : api
    }

    return service;

    /////////////////////

    function api(id) {
      return $resource(basePath + '/:id/:action', {
        id : id
      }, {
        'findBy' : {
          method : 'PUT',
          isArray : true
         },
        'notIn' : {
          method : 'PUT',
          params : {
            action : 'notIn'
          },
          isArray : true
        },
        'shoutOut' : {
          method: 'PUT',
          params : {
            action : 'shoutOut'
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

})(angular);
