{
  eventsListCtrl.$inject = ['$state', 'eventsService'];
  angular.module(APP_NAME).controller('eventsListCtrl', eventsListCtrl);


  function eventsListCtrl($state, eventsService) {

    var vm = this;

    vm.getEvents = function() {
      vm.events = eventsService.api().query();
    }

    vm.newEvent = function() {
      $state.transitionTo('events.manage');
    }

    vm.editEvent = function(event) {
      $state.transitionTo('events.manage', {
        id: event._id
      });
    }

    vm.viewEvent = function(event) {
      $state.transitionTo('events.view', {
        id: event._id
      });
    }

    vm.removeEvent = function(event) {
      eventsService.api(event._id).remove(function() {
        vm.getEvents();
      });
    }

    function initialize() {
      vm.getEvents();
    }

    initialize();

  }

}
