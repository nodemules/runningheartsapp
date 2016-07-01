// global angular
(function(angular) {

  'use strict'; 

  angular.module(APP_NAME).controller('playersCtrl', playersCtrl);

  playersCtrl.$inject = [ '$filter', '$state', '$mdMedia', 'playersService', 'usersService' ];

  function playersCtrl($filter, $state, $mdMedia, playersService, usersService) {
    
    var vm = this;

    vm.mdMedia = $mdMedia;

    vm.player = {};
    vm.directors = [];
    vm.selectedTab;

    vm.tabs = [
      {
        name : 'View',
        path : 'players.list'
      },
      {
        name : 'Manage',
        path : 'players.manage'
      }
    ]

    usersService.type(2).query(function(tdUsers) {
      angular.forEach(tdUsers, function(td) {
        vm.directors.push(td.player);
      })
    });

    vm.newPlayer = function() {
      vm.resetPlayer();
      vm.selectedTab = 1;
      $state.transitionTo('players.manage');
    }

    vm.resetPlayer = function() {
      vm.player = {};
    }

    vm.getPlayers = function() {
      vm.resetPlayer();
      vm.players = playersService.api().query();
      vm.selectedTab = 0;
      $state.transitionTo('players.list');
    }

    vm.setPlayer = function(player) {
      vm.player = player;
      vm.selectedTab = 1;
      $state.transitionTo('players.manage');
    }

    vm.save = function() {
      playersService.api().save(vm.player, function() {
        vm.getPlayers();
      });
    }

    vm.getPlayer = function(id) {
      vm.player = playersService.api(id).get();
    }

    vm.removePlayer = function(player) {
      playersService.api(player._id).remove(function() {
        vm.getPlayers();
      });
    }

    function initialize() {
      vm.getPlayers();
    }

    initialize();

  }    

})(angular);