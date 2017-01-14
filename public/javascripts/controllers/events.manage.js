// global angular
(function(angular) {

  'use strict';

  angular.module(APP_NAME).controller('eventsManageCtrl', eventsManageCtrl);

  eventsManageCtrl.$inject = ['$filter', '$state', '$stateParams', 'eventsService', 'usersService', 'playersService', 'venuesService'];

  function eventsManageCtrl($filter, $state, $stateParams, eventsService, usersService, playersService, venuesService) {

    var vm = this;

    vm.event = {};
    vm.directors = [];

    vm.getDirectors = function() {
      vm.directors = playersService.api().findBy({
        isTd: true
      });
    }

    vm.getVenues = function() {
      vm.venues = venuesService.api().query();
    }

    vm.resetEvent = function() {
      vm.event = {};
    }

    vm.setEvent = function(event) {
      event.td = $filter('filter')(vm.directors, {
        _id: event.td._id
      })[0];
      event.venue = $filter('filter')(vm.venues, {
        _id: event.venue._id
      })[0];
      event.date = new Date(event.date);
      vm.event = event;
    }

    vm.save = function() {
      eventsService.api().save(vm.event, function() {
        $state.transitionTo('events.list')
      });
    }

    vm.getEvent = function(id) {
      eventsService.api(id).get(function(event) {
        vm.setEvent(event);
      });
    }

    vm.removeEvent = function(event) {
      eventsService.api(event._id).remove(function() {
        $state.transitionTo('events.list')
      });
    }

    function initialize() {
      vm.getDirectors();
      vm.getVenues();
      if ($stateParams.id) {
        vm.getEvent($stateParams.id);
      }
    }

    initialize();

  }

})(angular);
