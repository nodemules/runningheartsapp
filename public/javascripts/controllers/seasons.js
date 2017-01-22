{
  /* global angular, APP_NAME */
  angular.module(APP_NAME).controller('seasonsCtrl', seasonsCtrl);

  seasonsCtrl.$inject = ['$filter', '$state', 'permissionsService'];

  function seasonsCtrl($filter, $state, permissionsService) {

    var vm = this;

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
