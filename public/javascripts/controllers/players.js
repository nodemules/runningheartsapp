{
  /* global angular, APP_NAME */
  angular.module(APP_NAME).controller('playersCtrl', playersCtrl);

  playersCtrl.$inject = ['$filter', '$state', '$mdMedia', 'permissionsService', 'Entities'];

  function playersCtrl($filter, $state, $mdMedia, permissionsService, Entities) {

    var vm = this;

    vm.ENTITY_TYPE = Entities;
    vm.mdMedia = $mdMedia;

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
