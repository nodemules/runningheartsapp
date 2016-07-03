// global angular
(function(angular) {

  'use strict'; 

  angular.module(APP_NAME).controller('playersListCtrl', playersListCtrl);

  playersListCtrl.$inject = [ '$filter', '$state', 'playersService' ];

  function playersListCtrl($filter, $state, playersService) {
    
    var vm = this;

    vm.newPlayer = function() {
      $state.transitionTo('players.manage');
    }

    vm.getPlayers = function() {
      vm.players = playersService.api().query();
    }

    vm.editPlayer = function(player) {
      $state.transitionTo('players.manage', { id : player._id });
    }

    vm.viewPlayer = function(player) {
      $state.transitionTo('players.view', { id : player._id });
    }

    vm.removePlayer = function(player) {
      playersService.api(player._id).remove(function() {
        vm.getPlayers();
      });
    }

    function initialize() {
      vm.getPlayers();
    }

    initialize();

  }    

})(angular);