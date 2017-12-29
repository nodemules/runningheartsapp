{

  /* global angular, APP_NAME, moment */

  angular.module(APP_NAME).controller('eventsViewCtrl', eventsViewCtrl);

  eventsViewCtrl.$inject = ['$state', '$stateParams', 'eventsService', 'gamesService', 'dialogService', 'seasonsService', 'errorService'];

  function eventsViewCtrl($state, $stateParams, eventsService, gamesService, dialogService, seasonsService, errorService) {

    var vm = this;

    vm.getEvent = function(id) {
      vm.event = eventsService.api(id).get(() => {
        vm.event.isToday = moment().isSame(vm.event.date, 'd');
        vm.event.season = seasonsService.api().byEventDate({date: vm.event.date});
      });
    };

    vm.removeEvent = function(event) {
      dialogService.confirm('Are you sure you want to delete this event?').then(() => {
        eventsService.api(event._id).remove(function() {
          if (event.statusId === 3) {
            vm.event.season.mainEventId = null;
            seasonsService.api(vm.event.season.seasonNumber).update(vm.event.season)
          }
          $state.go('events.list');
        });
      });
    };

    vm.makeMainEvent = function(event) {
      dialogService.confirm('Are you sure you want to make this the main event?').then(() => {
        event.statusId = 3
        eventsService.api().save(event);
        vm.event.season.mainEventId = event._id;
        seasonsService.api(vm.event.season.seasonNumber).update(vm.event.season);
        });
    }

    vm.newGame = function() {
      vm.game = {
        event: vm.event,
        number: vm.event.games.length + 1
      };
      if (vm.event.statusId = 3) {
        vm.game.statusId = 3
      };
      gamesService.api().create(vm.game, function(game) {
        vm.viewGame(game);
      }, function(err) {
        errorService.handleApiError(err);
      });

    };

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
