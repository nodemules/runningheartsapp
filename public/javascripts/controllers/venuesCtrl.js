// global angular
(function(angular) {

  'use strict';	

  angular.module(APP_NAME).controller('venuesCtrl', venuesCtrl);

  venuesCtrl.$inject = [ '$filter', '$state', '$mdMedia', 'venuesService', 'usersService' ];

  function venuesCtrl($filter, $state, $mdMedia, venuesService, usersService) {
    
    var vm = this;

    vm.mdMedia = $mdMedia;

    vm.venue = {};
    vm.directors = [];
    vm.selectedTab;

    vm.tabs = [
      {
        name : 'View',
        path : 'venues.list'
      },
      {
        name : 'Manage',
        path : 'venues.manage'
      }
    ]

    vm.days = [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday' ];

    usersService.type(2).query(function(tdUsers) {
      angular.forEach(tdUsers, function(td) {
        vm.directors.push(td.player);
      })
    });

    vm.newVenue = function() {
      vm.resetVenue();
      vm.selectedTab = 1;
      $state.transitionTo('venues.manage');
    }

    vm.resetVenue = function() {
      vm.venue = {};
    }

    vm.getVenues = function() {
      vm.resetVenue();
      vm.venues = venuesService.api().query();
      vm.venueIndex = 0;
      vm.selectedTab = 0;
      $state.transitionTo('venues.list');
    }

    vm.setVenue = function(venue) {
      venue.td = $filter('filter')(vm.directors, { _id : venue.td._id })[0];
      vm.venue = venue;
      vm.selectedTab = 1;
      $state.transitionTo('venues.manage');
    }

    vm.save = function() {
      venuesService.api().save(vm.venue, function() {
        vm.getVenues();
      });
    }

    vm.getVenue = function(id) {
      vm.venue = venuesService.api(id).get();
    }

    vm.removeVenue = function(venue) {
      venuesService.api(venue._id).remove(function() {
        vm.getVenues();
      });
    }

    vm.last5Venues = function() {
      vm.venueIndex += -5;
    }

    vm.next5Venues = function() {
      vm.venueIndex += 5;
    }

    function initialize() {
      vm.getVenues();
    }

    initialize();

  }    

})(angular);