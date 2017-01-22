{
  /* global angular, APP_NAME */
  angular.module(APP_NAME).controller('eventsCtrl', eventsCtrl);

  eventsCtrl.$inject = ['$filter', '$state', '$mdMedia', 'permissionsService'];

  function eventsCtrl($filter, $state, $mdMedia, permissionsService) {

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
