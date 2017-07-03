{
  /* global angular, APP_NAME */
  angular.module(APP_NAME).controller('venuesCtrl', venuesCtrl);

  venuesCtrl.$inject = ['$filter', '$state', '$stateParams', '$mdMedia', 'permissionsService', 'Entities'];

  function venuesCtrl($filter, $state, $stateParams, $mdMedia, permissionsService, Entities) {

    var vm = this;

    vm.mdMedia = $mdMedia;
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
