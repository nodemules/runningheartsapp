{

  /* global angular, APP_NAME */

  angular.module(APP_NAME).controller('eventsViewCtrl', eventsViewCtrl);

  eventsViewCtrl.$inject = ['$state', '$stateParams', 'eventsService', 'gamesService', 'dialogService', 'errorService'];

  function eventsViewCtrl($state, $stateParams, eventsService, gamesService, dialogService, errorService) {

    var vm = this;

    vm.getEvent = function(id) {
      vm.event = eventsService.api(id).get(() => {
        vm.event.isToday = moment().isSame(vm.event.date, 'd');
      });
    };

    vm.removeEvent = function(event) {
      dialogService.confirm('Are you sure you want to delete this event?').then(() => {
        eventsService.api(event._id).remove(function() {
          $state.go('events.list');
        });
      });
    };

    vm.newGame = function() {
      vm.game = {
        event: vm.event,
        number: vm.event.games.length + 1
      };
      gamesService.api().create(vm.game, function(game) {
        vm.viewGame(game);
      }, function(err) {
        errorService.handleApiError(err);
      });

    }

    vm.editEvent = function(event) {
      if (event) {
        $state.transitionTo('events.manage', {
          id: event._id
        });
      } else {
        $state.transitionTo('events.list');
      }

    };

    vm.viewGame = function(game) {
      $state.transitionTo('games.view', {
        id: game._id
      });
    };

    vm.completeGame = function(game) {
      var message =
        `Game will be marked complete and scores cannot be changed.
      Scores will be submitted to season standings.`;

      dialogService.confirm(message).then(() => {
        game.completed = true;
        gamesService.api().save(game);
      });
    };

    function initialize() {
      if ($stateParams.id) {
        vm.getEvent($stateParams.id);
      }
    }

    initialize();

  }

}
