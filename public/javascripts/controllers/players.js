{
  /* global angular, APP_NAME */
  angular.module(APP_NAME).controller('playersCtrl', playersCtrl);

  playersCtrl.$inject = ['$filter', '$state', '$mdMedia', 'permissionsService', 'RHP_ENTITY_TYPE'];

  function playersCtrl($filter, $state, $mdMedia, permissionsService, RHP_ENTITY_TYPE) {

    var vm = this;

    vm.ENTITY_TYPE = RHP_ENTITY_TYPE;
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
