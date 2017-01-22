{
  /* global angular, APP_NAME */
  angular.module(APP_NAME).controller('eventsCtrl', eventsCtrl);

  eventsCtrl.$inject = ['$filter', '$state', '$mdMedia', 'permissionsService', 'RHP_ENTITY_TYPE'];

  function eventsCtrl($filter, $state, $mdMedia, permissionsService, RHP_ENTITY_TYPE) {

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
