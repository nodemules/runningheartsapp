// global angular
(function(angular) {

  'use strict';

  angular.module(APP_NAME).controller('gamesPlayCtrl', gamesPlayCtrl);

  gamesPlayCtrl.$inject = [ '$filter', '$state', '$stateParams', 'gamesService'];

  function gamesPlayCtrl($filter, $state, $stateParams, gamesService) {

    var vm = this;

    vm.getGame = function(id) {
      vm.game = gamesService.api(id).get(function() {
        if (!vm.game.inProgress) {
          vm.game.startTime = Date.now(),
          vm.game.inProgress = true;
          vm.game.$save();
        }
      });
    }

    vm.playerOut = function(attendee) {
      attendee.score = 1;
      attendee.cashedOutTime = Date.now();
      vm.game.$save();

    }

    function initialize() {
      vm.getGame($stateParams.id);
    }

    initialize();
    
  }

})(angular);