// global angular
(function(angular) {

  'use strict';

  angular.module(APP_NAME).controller('eventsListCtrl', eventsListCtrl);

  eventsListCtrl.$inject = ['$filter', '$state', 'eventsService', 'usersService', 'playersService', 'venuesService', 'permissionsService'];

  function eventsListCtrl($filter, $state, eventsService, usersService, playersService, venuesService, permissionsService) {

    var vm = this;

    vm.permissions = {};

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

})(angular);
