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
      // TODO -- This doesn't actually work, the players Array is not sorted correctly when we
      // go and look up the index of the player we are marking out. @bh
      var idx = getNextRankOut();
      attendee.score = getScore(idx); 
      attendee.cashedOutTime = Date.now();
      attendee.rank = idx + 1;
      vm.game.$save();
    }

    vm.finalTable = function() {
      var nextRankOut = getNextRankOut() + 1;
      if (nextRankOut > 8) {
        // TODO -- Visually inform the user that they have too many players to finalize the game. @bh
        console.log("You have more than 8 players, fuck off.");
        return false;
      }
      vm.game.finalTable = true;
      vm.game.$save();
    }

    vm.finalizeGame = function() {
      var nextRankOut = getNextRankOut();

      if (nextRankOut < 0) {
        vm.game.finalize = true;
      } else {
        console.log('not done');
      }
    }

    vm.completeGame = function() {
      
      if (!vm.game.finalize){
        console.log('twilight zone');
        return false;
      }
      
      vm.game.completed = true;
      vm.game.$save();
    }

    function getNextRankOut() {

      var unscoredPlayers = $filter('filter')(vm.game.players, { score : 1 }, function(a,e) {
        return a < e || a === undefined;
      })
      return unscoredPlayers.length - 1;
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
