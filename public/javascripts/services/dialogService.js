{
  /* global angular, APP_NAME */
  angular.module(APP_NAME).factory('dialogService', dialogService);

  dialogService.$inject = ['$mdDialog'];

  function dialogService($mdDialog) {

    var service = {
      confirm
    }

    return service;

    /////////////////////

    function confirm(message) {
      var dialog = $mdDialog.confirm({
        title: 'Warning',
        textContent: message,
        ok: 'Yes',
        cancel: 'No'
      })
      return $mdDialog.show(dialog);
    }

    function dialogDefaults() {

    }

  }
}
