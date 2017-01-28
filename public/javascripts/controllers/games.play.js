{
  angular.module(APP_NAME).controller('gamesPlayCtrl', gamesPlayCtrl);

  gamesPlayCtrl.$inject = ['$filter', '$state', '$stateParams', 'gamesService'];

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
        return false;
      }
    }

    vm.checkScore = function(player) {
      var oldRank = getRank(player.score);

      if (!player.rank && player.rank !== 0) {
        return false;
      }
      if (player.rank > 8 || player.rank < 1) {
        player.rank = oldRank;
        return false;
      }
      if (player.rank > vm.game.players.length) {
        player.rank = vm.game.players.length;
      }
      var newScore = getScore(player.rank - 1);
      var counterPart = $filter('filter')(vm.game.players, {
        score: newScore
      })[0];
      counterPart.rank = oldRank;
      counterPart.score = getScore(oldRank - 1);
      player.score = newScore;
    }

    vm.noBlankAllowed = function(player) {
      if (!player.rank) {
        player.rank = getRank(player.score);
      }
    }

    vm.completeGame = function() {
      if (!vm.game.finalize) {
        return false;
      }

      vm.game.completed = true;
      vm.game.$save();
    }

    vm.isFinalizeable = function() {
      return getNextRankOut() < 0;
    }

    function getNextRankOut() {

      var unscoredPlayers = $filter('filter')(vm.game.players, {
        score: 1
      }, function(a, e) {
        return a < e || a === undefined;
      })
      return unscoredPlayers.length - 1;
    }

    function getScore(idx) {
      if (idx === 0) {
        return 10;
      } else if (idx < 8) {
        return 9 - idx;
      } else {
        return 1;
      }
    }

    function getRank(score) {
      if (score == 10) {
        return 1;
      } else if (score > 1 && score < 9) {
        return 10 - score;
      } else {
        return 9;
      }
    }

    function initialize() {
      vm.getGame($stateParams.id);
    }

    initialize();

  }

}
