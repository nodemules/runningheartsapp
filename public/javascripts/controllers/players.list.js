{
  /* global angular, APP_NAME */
  angular.module(APP_NAME).controller('playersListCtrl', playersListCtrl);

  playersListCtrl.$inject = ['$state', 'playersService'];

  function playersListCtrl($state, playersService) {

    var vm = this;

    vm.newPlayer = function() {
      $state.transitionTo('players.manage');
    }

    vm.getPlayers = function() {
      vm.players = playersService.api().query();
    }

    function initialize() {
      vm.getPlayers();
    }

    initialize();

  }

}
