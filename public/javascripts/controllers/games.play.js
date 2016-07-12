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
      var idx = vm.game.players.indexOf(attendee);
      attendee.score = getScore(idx); 
      attendee.cashedOutTime = Date.now();
      attendee.rank = idx + 1;
      vm.game.$save();
    }

    function getScore(idx) {
      if (idx == 0 ) {
        return 10;
      } else if (idx < 8) {
        return 9 - idx;
      } else {
        return 1;
      }
    }

    function initialize() {
      vm.getGame($stateParams.id);
    }

    initialize();
    
  }

})(angular);