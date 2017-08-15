{
  /* global angular, APP_NAME */
  angular.module(APP_NAME).controller('playersCtrl', playersCtrl);

  playersCtrl.$inject = ['$state', '$stateParams', 'permissionsService', 'Entities'];

  function playersCtrl($state, $stateParams, permissionsService, Entities) {

    var vm = this;

    vm.ENTITY_TYPE = Entities;

    function getPermissions() {
      permissionsService.getPermissions((permissions) => {
        vm.permissions = permissions
      });
    }

    function initialize() {
      getPermissions();
    }

    initialize();

  }

}
