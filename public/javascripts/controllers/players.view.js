{
  /* global angular, APP_NAME */

  'use strict';

  angular.module(APP_NAME).controller('playersViewCtrl', playersViewCtrl);

  playersViewCtrl.$inject = ['$filter', '$state', '$stateParams', 'playersService', 'statsService'];

  function playersViewCtrl($filter, $state, $stateParams, playersService, statsService) {

    var vm = this;

    vm.currentSeasonStats = true;

    vm.getPlayer = function(id) {
      vm.player = playersService.api(id).get(() => {
        if (!vm.player._id) {
          return $state.transitionTo('players.list');
        }
        vm.getPlayerStats(vm.currentSeasonStats);
      })
    }

    vm.getPlayerStats = function(currentSeason) {
      if (currentSeason) {
        statsService.api(vm.player._id).playerSeason((player) => {
          vm.player = player;
        });
      } else {
        statsService.api(vm.player._id).player((player) => {
          vm.player = player;
        });
      }
    }

    vm.shoutOut = function(id) {
      playersService.api(id).shoutOut(function(data) {
        vm.player.shoutOuts = data.shoutOuts;
      })
    }

    vm.save = function() {
      playersService.api().save(vm.player, function() {
        $state.transitionTo('players.list');
      })
    }

    vm.removePlayer = function(player) {
      playersService.api(player._id).remove(function() {
        $state.transitionTo('players.list');
      });
    }

    function initialize() {
      if ($stateParams.id) {
        vm.getPlayer($stateParams.id);
      }
    }

    initialize();

  }

}
