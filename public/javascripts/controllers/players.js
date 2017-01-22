{
  /* global angular, APP_NAME */
  angular.module(APP_NAME).controller('playersCtrl', playersCtrl);

  playersCtrl.$inject = ['$filter', '$state', '$mdMedia', 'permissionsService'];

  function playersCtrl($filter, $state, $mdMedia, permissionsService) {

    var vm = this;

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
