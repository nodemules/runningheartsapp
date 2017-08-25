 {

   /* global angular, APP_NAME */

   angular.module(APP_NAME).controller('gamesPlayCtrl', gamesPlayCtrl);

   gamesPlayCtrl.$inject = ['$filter', '$state', '$stateParams', '$mdDialog', 'gamesService', 'dialogService', 'eventsService', 'errorService'];

   function gamesPlayCtrl($filter, $state, $stateParams, $mdDialog, gamesService, dialogService, eventsService, errorService) {

     var vm = this;

     vm.selectPlayer = function(player) {
       var selected = player.selected;
       angular.forEach(vm.game.players, (player) => {
         player.selected = false;
       });
       player.selected = !selected;
     };

     vm.getGame = function(id) {
       vm.game = gamesService.api(id).get(function() {
         if (!vm.game.inProgress) {
           vm.game.startTime = Date.now();
           vm.game.inProgress = true;
           saveGame();
         } else {
           adjustScores(vm.game.players);
         }
       });
     };

     vm.playerOut = function(attendee) {
       var idx = getNextRankOut();
       attendee.score = getScore(idx);
       attendee.cashedOutTime = Date.now();
       attendee.rank = idx + 1;
       saveGame(angular.noop, function() {
         zeroOutAttendee(attendee);
       });
     };

     vm.playerBackIn = function(attendee) {
       var attendeeCopy = angular.copy(attendee);
       var message = `Marking a player back in will adjust all currently ranked
        players and remove this player's score and rank. Is this okay?`;
       dialogService.confirm(message).then(() => {
         var rankedPlayers = $filter('filter')(vm.game.players, function(player) {
           return player.rank < attendee.rank;
         });
         zeroOutAttendee(attendee);
         adjustAttendeeScores(rankedPlayers);
         saveGame(angular.noop, function() {
           var test = $filter('filter')(vm.game.players, function(player) {
             return player.rank <= attendeeCopy.rank;
           });
           angular.copy(attendeeCopy, attendee);
           adjustAttendeeScores(test, true);
         });
       });
     };

     vm.completeGame = function() {
       var message = `Game will be marked complete and scores cannot be changed.
      Scores will be submitted to season standings.`;
       dialogService.confirm(message).then(() => {
         vm.game.completed = true;
         saveGame(function() {
           $state.go('games.view', {
             id: vm.game._id
           });
         }, function() {
           vm.game.completed = false;
         });
       });
     };

     vm.canComplete = function() {
       return getNextRankOut() < 0;
     };



     vm.resetAllScores = function() {
       var message = 'This will reset all scores for all players in this game.';
       dialogService.confirm(message).then(() => {
         angular.forEach(vm.game.players, (player) => {
           zeroOutAttendee(player);
         });
         saveGame();
       });
     };

     function getNextRankOut() {

       var unscoredPlayers = $filter('filter')(vm.game.players, {
         score: 1
       }, function(a, e) {
         return a < e || a === undefined;
       });
       if (!unscoredPlayers) {
         return;
       }
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

     function zeroOutAttendee(attendee, keepTime) {
       delete attendee.score;
       delete attendee.rank;
       if (!keepTime) {
         delete attendee.cashedOutTime;
       }
     }

     function rankAttendee(attendee) {
       var idx = getNextRankOut();
       attendee.score = getScore(idx);
       attendee.cashedOutTime = Date.now();
       attendee.rank = getRank(attendee.score);
     }

     function adjustAttendeeScores(rankedPlayers, reverse) {
       angular.forEach(rankedPlayers, function(player) {
         if (reverse) {
           player.rank = player.rank - 2;
         }
         player.score = getScore(player.rank);
         player.rank = player.rank + 1;
       });

     }

     function adjustScores(players) {
       var orderedPlayers = $filter('orderBy')(players, 'cashedOutTime');
       angular.forEach(vm.game.players, function(player) {
         if (player.cashedOutTime) {
           zeroOutAttendee(player, true);
         }
       });
       angular.forEach(orderedPlayers, function(player) {
         if (player.cashedOutTime) {
           rankAttendee(player);
         }
       });
       vm.game.players = orderedPlayers;
       saveGame();
     }

     function initialize() {
       vm.getGame($stateParams.id);
     }

     function saveGame(cb, errCb) {
       vm.game.$save(function() {
         if (cb && typeof cb === 'function') {
           cb();
         }
       }, function(err) {
         errorService.handleApiError(err);
         if (errCb && typeof errCb === 'function') {
           errCb();
         }
       });
     }

     initialize();

   }

 }
