// global angular
(function(angular) {

  'use strict';

  angular.module(APP_NAME).controller('gamesPlayCtrl', gamesPlayCtrl);

  gamesPlayCtrl.$inject = ['$filter', '$state', '$stateParams', '$mdDialog', 'gamesService', 'dialogService'];

  function gamesPlayCtrl($filter, $state, $stateParams, $mdDialog, gamesService, dialogService) {

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

    vm.playerBackIn = function(attendee) {
      var message = `Marking a player back in will adjust all currently ranked
        players and remove this player's score and rank. Is this okay?`
      dialogService.confirm(message).then(() => {
        var rankedPlayers = $filter('filter')(vm.game.players, function(player) {
          return player.rank < attendee.rank;
        });
        zeroOutAttendee(attendee);
        adjustAttendeeScores(rankedPlayers);
        vm.game.$save();
      })
    }

    vm.finalTable = function() {
      var nextRankOut = getNextRankOut() + 1;
      var message;
      if (nextRankOut > 8) {
        message = `You have more than 8 players remaining. Do you want to
        just select members of the final table?`
        return dialogService.confirm(message).then(() => {
          $state.go('games.ft', {
            id: vm.game._id
          })
        })
      }
      message = `Are you sure you want to start the final table? Players
      cannot buy back in but you will be able to edit the final standings later.`
      dialogService.confirm(message).then(() => {
        vm.game.finalTable = true;
        vm.game.$save();
      })

    }

    vm.finalizeGame = function() {
      var message = `Are you sure you want to finalize the game? The next screen
      will allow you to edit standings if there was a mistake or press complete
      to finish.`
      dialogService.confirm(message).then(() => {
        vm.game.finalize = true;
      })
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
      var message = `Game will be marked complete and scores cannot be changed.
      Scores will be submitted to season standings.`
      dialogService.confirm(message).then(() => {
        vm.game.completed = true;
        vm.game.$save();
      })
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

    function zeroOutAttendee(attendee) {
      delete attendee.score;
      delete attendee.cashedOutTime;
      delete attendee.rank;
    }

    function adjustAttendeeScores(rankedPlayers) {
      angular.forEach(rankedPlayers, function(player) {
        player.score = getScore(player.rank);
        player.rank = player.rank + 1;
      })

    }

    function initialize() {
      vm.getGame($stateParams.id);
    }

    initialize();

  }

})(angular);
