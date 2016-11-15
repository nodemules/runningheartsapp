// global angular
(function(angular) {

  'use strict';

  angular.module(APP_NAME).controller('playersViewCtrl', playersViewCtrl);

  playersViewCtrl.$inject = [ '$filter', '$state', '$stateParams', 'playersService', 'statsService' ];

  function playersViewCtrl($filter, $state, $stateParams, playersService, statsService) {

    var vm = this;

    vm.getPlayer = function(id) {
      vm.player = statsService.api(id).player(function(){
        if (!vm.player._id) {
          vm.player = playersService.api(id).get();
        }
      });
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

})(angular);
