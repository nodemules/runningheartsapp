{
  /* global angular, APP_NAME */
  angular.module(APP_NAME).controller('venuesCtrl', venuesCtrl);

  venuesCtrl.$inject = ['$filter', '$state', '$stateParams', '$mdMedia', 'permissionsService'];

  function venuesCtrl($filter, $state, $stateParams, $mdMedia, permissionsService) {

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
