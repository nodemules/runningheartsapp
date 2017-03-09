// global angular
(function(angular) {

  'use strict';

  angular.module(APP_NAME).controller('seasonsViewCtrl', gamesViewCtrl);

  gamesViewCtrl.$inject = ['$state', '$stateParams', 'seasonsService', 'dialogService'];

  function gamesViewCtrl($state, $stateParams, seasonsService, dialogService) {

    var vm = this;

    vm.newSeason = function() {
      var seasonNumber;
      dialogService.confirm('Are you sure you want to start a new season?').then(() => {
        if (vm.seasons && vm.seasons.length) {
          seasonNumber = vm.seasons[0].seasonNumber + 1;
        } else {
          seasonNumber = 1;
        }
        vm.season = seasonsService.api(seasonNumber).save(function() {
          vm.getSeason();
        });
      })
    }

    vm.getSeason = function(id) {
      if (id) {
        vm.season = seasonsService.api(id).get();
      } else {
        vm.seasons = seasonsService.api().query(function(data) {});
      }
    }

    function initialize() {
      vm.getSeason($stateParams.id);
    }

    initialize();

  }

})(angular);
