{
  /* global angular, APP_NAME */
  angular.module(APP_NAME).controller('eventsCtrl', eventsCtrl);

  eventsCtrl.$inject = ['$filter', '$state', '$mdMedia', 'permissionsService', 'Entities'];

  function eventsCtrl($filter, $state, $mdMedia, permissionsService, Entities) {

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
