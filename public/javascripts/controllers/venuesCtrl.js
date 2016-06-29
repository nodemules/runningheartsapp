// global angular
(function(angular) {

  'use strict';	

  angular.module(APP_NAME).controller('venuesCtrl', venuesCtrl);

  venuesCtrl.$inject = [ '$filter', 'venuesService', 'usersService' ];

  function venuesCtrl($filter, venuesService, usersService) {
    
    var vm = this;

    vm.venue = {};
    vm.directors = [];

    vm.days = [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday' ];

    usersService.type(2).query(function(tdUsers) {
      angular.forEach(tdUsers, function(td) {
        vm.directors.push(td.player);
      })
    });

    vm.newVenue = function() {
      vm.resetVenue();
      vm.new = true;
    }

    vm.resetVenue = function() {
      vm.venue = {};
    }

    vm.getVenues = function() {
      vm.resetVenue();
      vm.edit = vm.new = false;
      vm.venues = venuesService.api().query();
    }

    vm.setVenue = function(venue) {
      vm.edit = true;
      venue.td = $filter('filter')(vm.directors, { _id : venue.td._id })[0];
      vm.venue = venue;
    }

    vm.save = function() {
      venuesService.api().save(vm.venue, function() {
        vm.edit = vm.new = false;
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

    function initialize() {
      vm.getVenues();
    }

    initialize();

  }    

})(angular);