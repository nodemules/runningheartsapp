// global angular
(function(angular) {

  'use strict'; 

  angular.module(APP_NAME).controller('eventsCtrl', eventsCtrl);

  eventsCtrl.$inject = [ '$filter', '$state', '$mdMedia', 'eventsService', 'usersService', 'playersService', 'venuesService' ];

  function eventsCtrl($filter, $state, $mdMedia, eventsService, usersService, playersService, venuesService) {
    
    var vm = this;

    vm.mdMedia = $mdMedia;

    vm.event = {};
    vm.directors = [];

    vm.getDirectors = function() {
      vm.directors = playersService.api().findBy({isTd : true}); 
    }

    vm.getEvents = function() {
      vm.resetEvent();
      vm.events = eventsService.api().query();
      $state.transitionTo('events.list');
    }

    vm.getVenues = function() {
      vm.venues = venuesService.api().query();
    }
    
    vm.newEvent = function() {
      vm.resetEvent();
      $state.transitionTo('events.manage');
    }

    vm.resetEvent = function() {
      vm.event = {};
    }

    vm.setEvent = function(event) {
      event.td = $filter('filter')(vm.directors, { _id : event.td._id })[0];
      event.venue = $filter('filter')(vm.venues, { _id : event.venue._id })[0];      
      vm.event = event;
      $state.transitionTo('events.manage');
    }

    vm.save = function() {
      eventsService.api().save(vm.event, function() {
        vm.getEvents();
      });
    }

    vm.getEvent = function(id) {
      vm.event = eventsService.api(id).get();
    }

    vm.removeEvent = function(event) {
      eventsService.api(event._id).remove(function() {
        vm.getEvents();
      });
    }

    function initialize() {
      vm.getEvents();
      vm.getDirectors();
      vm.getVenues();
    }

    initialize();

  }    

})(angular);