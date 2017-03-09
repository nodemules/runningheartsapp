{
  /* global angular, APP_NAME */
  angular.module(APP_NAME).controller('playersListCtrl', playersListCtrl);

  playersListCtrl.$inject = ['$filter', '$state', 'playersService', 'dialogService'];

  function playersListCtrl($filter, $state, playersService, dialogService) {

    var vm = this;

    vm.newPlayer = function() {
      $state.transitionTo('players.manage');
    }

    vm.getPlayers = function() {
      vm.players = playersService.api().query();
    }

    vm.editPlayer = function(player) {
      $state.transitionTo('players.manage', {
        id: player._id
      });
    }

    vm.viewPlayer = function(player) {
      $state.transitionTo('players.view', {
        id: player._id
      });
    }

    vm.removePlayer = function(player) {
      dialogService.confirm('Are you sure you want to delete this player?').then(() => {
        playersService.api(player._id).remove(function() {
          vm.getPlayers();
        });
      });
    }

    function initialize() {
      vm.getPlayers();
    }

    initialize();

  }

}
