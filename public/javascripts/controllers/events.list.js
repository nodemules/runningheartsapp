{

  /* global angular, APP_NAME, moment */

  angular.module(APP_NAME).controller('eventsListCtrl', eventsListCtrl);

  eventsListCtrl.$inject = ['$filter', '$state', 'eventsService', 'usersService', 'playersService', 'venuesService',
    'permissionsService', 'dialogService'
  ];

  function eventsListCtrl($filter, $state, eventsService, usersService, playersService, venuesService,
    permissionsService, dialogService) {

    var vm = this;

    vm.permissions = {};

    vm.getEvents = function() {
      vm.events = eventsService.api().season();
    };

    vm.newEvent = function() {
      $state.transitionTo('events.manage');
    };

    vm.viewEvent = function(ev) {
      $state.transitionTo('events.view', {
        id: ev._id
      });
    };

    vm.isCurrentEvent = function(ev) {
      return moment().isSame(moment(ev.date), 'd');
    };

    function initialize() {
      vm.getEvents();
    };

    initialize();

  }

}
