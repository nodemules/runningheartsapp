{
  /* global angular, APP_NAME */

  angular.module(APP_NAME).controller('statsSeasonCtrl', statsSeasonCtrl);

  statsSeasonCtrl.$inject = ['$filter', '$state', '$stateParams', 'statsService', 'usersService', 'playersService', 'venuesService', 'seasonsService'];

  function statsSeasonCtrl($filter, $state, $stateParams, statsService, usersService, playersService, venuesService, seasonsService) {

    var vm = this;

    vm.shoutOut = function(id) {
      playersService.api(id).shoutOut(function(data) {
        vm.player.shoutOuts = data.shoutOuts;
      })
    }

    function getSeasons(seasonId) {
      vm.seasons = seasonsService.api().query(function() {
        vm.currentSeason = vm.seasons[0];
        vm.getSeasonStats(seasonId ? seasonId : vm.currentSeason.seasonNumber);
      });
    }

    vm.getSeasonStats = function(id) {
      if (id) {
        vm.seasonNumber = id;
        vm.seasonStats = statsService.api(id).seasons();
      } else {
        vm.seasonNumber = null;
        vm.seasonStats = statsService.api().players();
      }
    }

    function initialize() {
      getSeasons($stateParams.id);
    }

    initialize();

  }

}
