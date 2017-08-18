{
  /* global angular, APP_NAME */

  angular.module(APP_NAME).controller('playersManageCtrl', playersManageCtrl);

  playersManageCtrl.$inject = ['$filter', '$state', '$stateParams', 'playersService', 'historyService', 'formService',
    'errorService'
  ];

  function playersManageCtrl($filter, $state, $stateParams, playersService, historyService, formService, errorService) {

    var vm = this;

    vm.forms = {};

    vm.getPlayer = function(id) {
      vm.player = playersService.api(id).get();
    }

    vm.save = function() {
      playersService.api().save(vm.player, function() {
        $state.transitionTo('players.list');
      }, (err) => {
        errorService.handleApiError(err);
      })
    }

    vm.validate = function(player) {
      vm.forms.playerForm.name.$setValidity('nameTaken', true);
      if (!player || !player.name) {
        return;
      }
      playersService.api().validate(player, angular.noop, (err) => {
        switch (err.data.code) {
          case 'PLAYER_NAME_TAKEN':
            err.config.data.$$saving = false;
            vm.forms.playerForm.name.$setValidity('nameTaken', false)
            break;
          default:
            errorService.handleApiError(err);
            break;
        }
      })
    }

    vm.cancel = function() {
      historyService.goPrevious();
    }

    vm.reset = function(elem, validator) {
      formService.resetValidity(elem, validator);
    }

    function initialize() {
      if ($stateParams.id) {
        vm.getPlayer($stateParams.id);
      }
    }

    initialize();

  }

}
