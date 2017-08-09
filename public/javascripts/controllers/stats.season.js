{
  /* global angular, APP_NAME */

  angular.module(APP_NAME).controller('statsSeasonCtrl', statsSeasonCtrl);

  statsSeasonCtrl.$inject = ['$filter', '$state', '$stateParams', 'statsService', 'usersService', 'playersService',
    'venuesService', 'seasonsService'
  ];

  function statsSeasonCtrl($filter, $state, $stateParams, statsService, usersService, playersService, venuesService,
    seasonsService) {

    var vm = this;

    vm.shoutOut = function(id) {
      playersService.api(id).shoutOut(function(data) {
        vm.player.shoutOuts = data.shoutOuts;
      });
    };

    function getSeasons(seasonId) {
      vm.seasons = seasonsService.api().query(function() {
        vm.latestSeason = vm.seasons[0];
        if (!seasonId && !$stateParams.all) {
          seasonId = vm.latestSeason.seasonNumber;
        }
        vm.getSeasonStats(seasonId);
      });
    }

    vm.getSeasonStats = function(id) {
      if (id) {
        vm.season = $filter('filter')(vm.seasons, {
          seasonNumber: id
        })[0];
        vm.seasonStats = statsService.api(id).seasons(() => {
          getHighestScore();
        });
      } else {
        vm.season = null;
        vm.seasonStats = statsService.api().players(() => {
          getHighestScore();
        });
      }
    };

    function getHighestScore() {
      if (!vm.seasonStats) {
        return 0;
      }
      var totalPoints = vm.seasonStats.map((o) => {
        return o.totalPoints;
      })
      vm.highestScore = Math.max.apply(null, totalPoints);
    }

    function initialize() {
      getSeasons($stateParams.id);
    }

    initialize();

  }

}
