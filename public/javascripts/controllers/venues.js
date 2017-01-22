{
  /* global angular, APP_NAME */
  angular.module(APP_NAME).controller('venuesCtrl', venuesCtrl);

  venuesCtrl.$inject = ['$filter', '$state', '$stateParams', '$mdMedia', 'permissionsService', 'RHP_ENTITY_TYPE'];

  function venuesCtrl($filter, $state, $stateParams, $mdMedia, permissionsService, RHP_ENTITY_TYPE) {

    var vm = this;

    vm.mdMedia = $mdMedia;
    vm.ENTITY_TYPE = RHP_ENTITY_TYPE;

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
