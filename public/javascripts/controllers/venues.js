// global angular
(function(angular) {

  'use strict';	

  angular.module(APP_NAME).controller('venuesCtrl', venuesCtrl);

  venuesCtrl.$inject = [ '$filter', '$state', '$stateParams', '$mdMedia', 'venuesService'];

  function venuesCtrl($filter, $state, $stateParams, $mdMedia, venuesService) {
    
    var vm = this;

    vm.mdMedia = $mdMedia;

    vm.venue = {};
    vm.directors = [];

    vm.days = [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday' ];

    vm.resetVenue = function() {
      vm.venue = {};
    }

    vm.getVenues = function() {
      vm.venues = venuesService.api().query();
    }

    vm.save = function() {
      venuesService.api().save(vm.venue, function() {
        vm.getVenues();
      });
    }

    vm.getVenue = function(id) {
      vm.venue = venuesService.api(id).get();
    }

    function initialize() {
      vm.getVenues();
    }

    initialize();

  }    

})(angular);