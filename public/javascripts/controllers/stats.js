{
  angular.module(APP_NAME).controller('statsCtrl', statsCtrl);

  statsCtrl.$inject = ['$filter', '$state', 'statsService', 'usersService', 'playersService', 'venuesService', 'seasonsService'];

  function statsCtrl($filter, $state, statsService, usersService, playersService, venuesService, seasonsService) {

    var vm = this;

    function getSeasons() {
      vm.seasons = seasonsService.api().query(function() {
        vm.currentSeason = vm.seasons[0];
      });
    }

    function initialize() {
      getSeasons();
    }

    initialize();

  }

}
