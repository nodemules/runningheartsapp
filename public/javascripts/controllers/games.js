{
  /* global angular, APP_NAME */
  angular.module(APP_NAME).controller('gamesCtrl', gamesCtrl);

  gamesCtrl.$inject = ['permissionsService'];

  function gamesCtrl(permissionsService) {

    var vm = this;

    function getPermissions() {
      permissionsService.getPermissions((permissions) => {
        vm.permissions = permissions;
      });
    }

    function initialize() {
      getPermissions();
    }

    initialize();

  }

}
