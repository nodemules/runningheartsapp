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
    vm.selectedTab;

    vm.tabs = [
      {
        name : 'List',
        path : 'venues.list'
      },
      {
        name : 'Manage',
        path : 'venues.manage'
      },
      {
        name : 'View',
        path : 'venues.view'
      }
    ]

    vm.days = [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday' ];

    vm.newVenue = function() {
      vm.resetVenue();
      vm.selectedTab = 1;
      $state.transitionTo('venues.manage');
    }

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

    function setTab() {
      var tab = $state.current.name;
      if (tab === 'venues.view') {
        vm.selectedTab = 2;
      } else if (tab === 'venues.manage') {
        vm.selectedTab = 1;
      } else {
        $state.go('venues.list')
        vm.selectedTab = 0;
      }
    }

    function initialize() {
      vm.getVenues();
      setTab();
    }

    initialize();

  }    

})(angular);