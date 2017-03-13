// global angular
(function(angular) {

  angular.module(APP_NAME).factory('usersService', usersService);

  usersService.$inject = ['$resource'];

  function usersService($resource) {

    var basePath = '/api/users'

    var service = {
      api
    }

    return service;

    /////////////////////

    function api(id) {
      return $resource(basePath + '/:action', {
        id
      }, {
        'save': {
          method: 'POST',
          transformRequest: function(data) {
            data.$$saving = true;
            return angular.toJson(data);
          },
          transformResponse: function(data) {
            data.$$saving = false;
            return angular.fromJson(data);
          }
        },
      });
    }

  }

})(angular);
