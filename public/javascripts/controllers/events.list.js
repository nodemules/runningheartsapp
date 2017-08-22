{

  /* global angular, APP_NAME, moment */

  angular.module(APP_NAME).controller('eventsListCtrl', eventsListCtrl);

  eventsListCtrl.$inject = ['$state', '$timeout', 'eventsService', 'Utils'];

  function eventsListCtrl($state, $timeout, eventsService, Utils) {

    var vm = this;

    vm.list = {};

    vm.getEvents = function() {
      vm.events = eventsService.api().season(setListIndex);
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

    function setListIndex(events) {
      var todaysEvents = Utils.arrays(events).find(vm.isCurrentEvent);
      if (todaysEvents.length) {
        $timeout(() => {
          vm.list.topIndex = Utils.arrays(events).orderedIndexOf('-date', {
            _id: todaysEvents[0]._id
          });
        });
      }
    }

    function initialize() {
      vm.getEvents();
    };

    initialize();

  }

}
