{
  /* global angular, APP_NAME */
  eventsCtrl.$inject = ['$filter', '$state', '$mdMedia', 'permissionsService', 'RHP_ENTITY_TYPE'];
  angular.module(APP_NAME).controller('eventsCtrl', eventsCtrl);


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
