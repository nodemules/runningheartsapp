'use strict';

var APP_NAME = 'runningHeartsApp';{
  /* global angular */

  var APP_DEPENDENCIES = ['ui.router', 'ngMaterial', 'ngAnimate', 'ngAria', 'ngMessages', 'ngResource'];
  angular.module(APP_NAME, APP_DEPENDENCIES).config(['$mdThemingProvider', function ($mdThemingProvider) {
    var whiteMap = $mdThemingProvider.extendPalette('red', {
      '500': '#ffffff'
    });
    $mdThemingProvider.definePalette('white', whiteMap);

    $mdThemingProvider.theme('default').primaryPalette('deep-orange').accentPalette('deep-orange', {
      'default': '900'
    }).backgroundPalette('grey', {
      'hue-1': '400'
    });
  }]).config(['$locationProvider', function ($locationProvider) {

    $locationProvider.html5Mode({
      enabled: true,
      requireBase: true
    });
  }])
  //this fixes the unhandled rejection error ui-router is throwing but we should investigate further -jr
  .config(['$qProvider', function ($qProvider) {
    $qProvider.errorOnUnhandledRejections(false);
  }]);
}

{
  /* global angular, APP_NAME */
  angular.module(APP_NAME).constant('RHP_ENTITY_TYPE', {
    'PLAYER': 1,
    'EVENT': 2,
    'VENUE': 3,
    'GAME': 4
  });
}

{
  var eventsCtrl = function eventsCtrl($filter, $state, $mdMedia, permissionsService, RHP_ENTITY_TYPE) {

    var vm = this;

    vm.mdMedia = $mdMedia;
    vm.ENTITY_TYPE = RHP_ENTITY_TYPE;

    function getPermissions() {
      permissionsService.getPermissions(function (permissions) {
        vm.permissions = permissions;
      });
    }

    function initialize() {
      getPermissions();
    }

    initialize();
  };

  /* global angular, APP_NAME */
  eventsCtrl.$inject = ['$filter', '$state', '$mdMedia', 'permissionsService', 'RHP_ENTITY_TYPE'];
  angular.module(APP_NAME).controller('eventsCtrl', eventsCtrl);
}

{
  var eventsListCtrl = function eventsListCtrl($state, eventsService) {

    var vm = this;

    vm.getEvents = function () {
      vm.events = eventsService.api().query();
    };

    vm.newEvent = function () {
      $state.transitionTo('events.manage');
    };

    vm.editEvent = function (event) {
      $state.transitionTo('events.manage', {
        id: event._id
      });
    };

    vm.viewEvent = function (event) {
      $state.transitionTo('events.view', {
        id: event._id
      });
    };

    vm.removeEvent = function (event) {
      eventsService.api(event._id).remove(function () {
        vm.getEvents();
      });
    };

    function initialize() {
      vm.getEvents();
    }

    initialize();
  };

  eventsListCtrl.$inject = ['$state', 'eventsService'];
  angular.module(APP_NAME).controller('eventsListCtrl', eventsListCtrl);
}

{
  var eventsManageCtrl = function eventsManageCtrl($filter, $state, $stateParams, eventsService, usersService, playersService, venuesService, historyService) {

    var vm = this;

    vm.event = {};
    vm.directors = [];

    vm.getDirectors = function () {
      vm.directors = playersService.api().findBy({
        isTd: true
      });
    };

    vm.getVenues = function () {
      vm.venues = venuesService.api().query();
    };

    vm.resetEvent = function () {
      vm.event = {};
    };

    vm.setEvent = function (event) {
      event.td = $filter('filter')(vm.directors, {
        _id: event.td._id
      })[0];
      event.venue = $filter('filter')(vm.venues, {
        _id: event.venue._id
      })[0];
      event.date = new Date(event.date);
      vm.event = event;
    };

    vm.save = function () {
      eventsService.api().save(vm.event, function () {
        $state.transitionTo('events.list');
      });
    };

    vm.cancel = function () {
      historyService.goPrevious();
    };

    vm.getEvent = function (id) {
      eventsService.api(id).get(function (event) {
        vm.setEvent(event);
      });
    };

    vm.removeEvent = function (event) {
      eventsService.api(event._id).remove(function () {
        $state.transitionTo('events.list');
      });
    };

    function initialize() {
      vm.getDirectors();
      vm.getVenues();
      if ($stateParams.id) {
        vm.getEvent($stateParams.id);
      }
    }

    initialize();
  };

  angular.module(APP_NAME).controller('eventsManageCtrl', eventsManageCtrl);

  eventsManageCtrl.$inject = ['$filter', '$state', '$stateParams', 'eventsService', 'usersService', 'playersService', 'venuesService', 'historyService'];
}

{
  var eventsViewCtrl = function eventsViewCtrl($filter, $state, $stateParams, eventsService, playersService, venuesService, gamesService) {

    var vm = this;

    vm.getEvent = function (id) {
      vm.event = eventsService.api(id).get();
    };

    vm.removeEvent = function (event) {
      eventsService.api(event._id).remove(function () {
        vm.getEvents();
      });
    };

    vm.newGame = function () {
      var newGame = {
        event: vm.event,
        number: vm.event.games.length + 1
      };
      gamesService.api().create(newGame, function (game) {
        vm.viewGame(game);
      });
    };

    vm.editEvent = function (event) {
      if (event) {
        $state.transitionTo('events.manage', {
          id: event._id
        });
      } else {
        $state.transitionTo('events.list');
      }
    };

    vm.viewGame = function (game) {
      $state.transitionTo('games.view', {
        id: game._id
      });
    };

    function initialize() {
      if ($stateParams.id) {
        vm.getEvent($stateParams.id);
      }
    }

    initialize();
  };

  angular.module(APP_NAME).controller('eventsViewCtrl', eventsViewCtrl);

  eventsViewCtrl.$inject = ['$filter', '$state', '$stateParams', 'eventsService', 'playersService', 'venuesService', 'gamesService'];
}

{
  var gamesCtrl = function gamesCtrl(permissionsService) {

    var vm = this;

    function getPermissions() {
      permissionsService.getPermissions(function (permissions) {
        vm.permissions = permissions;
      });
    }

    function initialize() {
      getPermissions();
    }

    initialize();
  };

  /* global angular, APP_NAME */
  angular.module(APP_NAME).controller('gamesCtrl', gamesCtrl);

  gamesCtrl.$inject = ['permissionsService'];
}

{
  var gamesPlayCtrl = function gamesPlayCtrl($filter, $state, $stateParams, gamesService) {

    var vm = this;

    vm.getGame = function (id) {
      vm.game = gamesService.api(id).get(function () {
        if (!vm.game.inProgress) {
          vm.game.startTime = Date.now(), vm.game.inProgress = true;
          vm.game.$save();
        }
      });
    };

    vm.playerOut = function (attendee) {
      var idx = getNextRankOut();
      attendee.score = getScore(idx);
      attendee.cashedOutTime = Date.now();
      attendee.rank = idx + 1;
      vm.game.$save();
    };

    vm.finalTable = function () {
      var nextRankOut = getNextRankOut() + 1;
      if (nextRankOut > 8) {
        // TODO -- Visually inform the user that they have too many players to finalize the game. @bh
        return false;
      }
      vm.game.finalTable = true;
      vm.game.$save();
    };

    vm.finalizeGame = function () {
      var nextRankOut = getNextRankOut();

      if (nextRankOut < 0) {
        vm.game.finalize = true;
      } else {
        return false;
      }
    };

    vm.checkScore = function (player) {
      var oldRank = getRank(player.score);

      if (!player.rank && player.rank !== 0) {
        return false;
      }
      if (player.rank > 8 || player.rank < 1) {
        player.rank = oldRank;
        return false;
      }
      if (player.rank > vm.game.players.length) {
        player.rank = vm.game.players.length;
      }
      var newScore = getScore(player.rank - 1);
      var counterPart = $filter('filter')(vm.game.players, {
        score: newScore
      })[0];
      counterPart.rank = oldRank;
      counterPart.score = getScore(oldRank - 1);
      player.score = newScore;
    };

    vm.noBlankAllowed = function (player) {
      if (!player.rank) {
        player.rank = getRank(player.score);
      }
    };

    vm.completeGame = function () {
      if (!vm.game.finalize) {
        return false;
      }

      vm.game.completed = true;
      vm.game.$save();
    };

    vm.isFinalizeable = function () {
      return getNextRankOut() < 0;
    };

    function getNextRankOut() {

      var unscoredPlayers = $filter('filter')(vm.game.players, {
        score: 1
      }, function (a, e) {
        return a < e || a === undefined;
      });
      return unscoredPlayers.length - 1;
    }

    function getScore(idx) {
      if (idx === 0) {
        return 10;
      } else if (idx < 8) {
        return 9 - idx;
      } else {
        return 1;
      }
    }

    function getRank(score) {
      if (score == 10) {
        return 1;
      } else if (score > 1 && score < 9) {
        return 10 - score;
      } else {
        return 9;
      }
    }

    function initialize() {
      vm.getGame($stateParams.id);
    }

    initialize();
  };

  angular.module(APP_NAME).controller('gamesPlayCtrl', gamesPlayCtrl);

  gamesPlayCtrl.$inject = ['$filter', '$state', '$stateParams', 'gamesService'];
}

{
  var gamesPlayersCtrl = function gamesPlayersCtrl($filter, $state, $stateParams, $mdMedia, playersService, gamesService) {

    var vm = this;

    vm.game = {};

    vm.mdMedia = $mdMedia;

    vm.getGame = function (gameId) {
      vm.game = gamesService.api(gameId).get(function () {
        vm.getPlayers();
      });
    };

    vm.getPlayers = function () {
      var players = [];
      angular.forEach(vm.game.players, function (player) {
        players.push(player.player._id);
      });
      if (vm.showAllPlayers) {
        vm.players = playersService.api().query(function () {
          ready();
        });
      } else {
        vm.players = playersService.api().notIn({
          players: players
        }, function () {
          ready();
        });
      }
    };

    vm.isSelected = function (player) {
      var attendee = $filter('filter')(vm.game.players, {
        player: {
          _id: player._id
        }
      })[0];
      var idx = vm.game.players.indexOf(attendee);
      var selected = false;
      if (idx != -1) {
        selected = true;
      }
      return selected;
    };

    vm.toggleSelection = function (player) {
      var attendee = $filter('filter')(vm.game.players, {
        player: {
          _id: player._id
        }
      })[0];
      var idx = vm.game.players.indexOf(attendee);
      if (idx > -1) {
        vm.game.players.splice(idx, 1);
      } else {
        vm.game.players.push({
          player: player
        });
      }
    };

    vm.addPlayersToGame = function () {
      gamesService.api().save(vm.game, function () {
        $state.transitionTo('games.view', {
          id: vm.game._id
        });
      });
    };

    function ready() {
      vm.ready = true;
    }

    function initialize() {
      vm.getGame($stateParams.gameId);
    }

    initialize();
  };

  angular.module(APP_NAME).controller('gamesPlayersCtrl', gamesPlayersCtrl);

  gamesPlayersCtrl.$inject = ['$filter', '$state', '$stateParams', '$mdMedia', 'playersService', 'gamesService'];
}

{
  var gamesViewCtrl = function gamesViewCtrl($state, $stateParams, gamesService) {

    var vm = this;

    vm.getGame = function (id) {
      vm.game = gamesService.api(id).get();
    };

    function initialize() {
      if ($stateParams.id) {
        vm.getGame($stateParams.id);
      }
    }

    initialize();
  };

  angular.module(APP_NAME).controller('gamesViewCtrl', gamesViewCtrl);

  gamesViewCtrl.$inject = ['$state', '$stateParams', 'gamesService'];
}

{
  var homeCtrl = function homeCtrl($filter, $state, $scope, $mdSidenav, $mdMedia, $q, eventsService, playersService, seasonsService, statsService, venuesService, gamesService, permissionsService, authApiService, authService) {

    var vm = this;

    vm.mdMedia = $mdMedia;

    vm.messages = {};

    vm.loadTabs = function () {

      return $q.all([eventsService.api().count().$promise, venuesService.api().count().$promise, playersService.api().count().$promise, seasonsService.api().query().$promise, statsService.api().players().$promise]).then(function (result) {
        vm.messages = {
          events: result[0].count,
          venues: result[1].count,
          players: result[2].count,
          seasons: result[3].length,
          stats: result[4][0] ? result[4][0].name : 'No one'
        };
        var isLoggedIn = authService.isAuth();
        var loginTab = {
          id: 0,
          label: 'Login',
          message: 'Admins Login Here',
          path: 'login'
        };
        var logoutTab = {
          id: -1,
          label: 'Logout',
          message: 'Logout of the application',
          path: 'home',
          options: {
            reload: true
          }
        };
        vm.tabs = [{
          id: 1,
          label: 'Home',
          message: 'This is the home page',
          path: 'home'
        }, {
          id: 2,
          label: 'Events',
          message: 'See upcoming events',
          alert: vm.messages.events + ' Total Events',
          path: 'events'
        }, {
          id: 3,
          label: 'Venues',
          message: 'Check out active venues',
          alert: vm.messages.venues + ' Total Venues',
          path: 'venues'
        }, {
          id: 4,
          label: 'Players',
          message: 'View player information',
          alert: vm.messages.players + ' Total Registered Players',
          path: 'players'
        }, {
          id: 5,
          label: 'Standings',
          message: 'View Player Standings',
          alert: vm.messages.stats + ' is currently leading!',
          path: 'stats'
        }, {
          id: 6,
          label: 'Seasons',
          message: 'View Season information',
          alert: 'We are Currently in Season ' + vm.messages.seasons,
          path: 'seasons.view'
        }];
        isLoggedIn ? vm.tabs.push(logoutTab) : vm.tabs.unshift(loginTab);
        vm.activeTab = vm.tabs[0];
      });
    };

    vm.selectTab = function (tab) {
      if (tab.id === -1) {
        authApiService.api().logout(function () {
          $state.transitionTo(tab.path, {}, {
            reload: true
          });
        });
        return vm.toggleMenu();
      }
      vm.activeTab = tab;
      $state.go(tab.path, tab.params, tab.options);
      vm.toggleMenu();
    };

    vm.toggleMenu = function () {
      $mdSidenav('appSidenav').toggle();
    };

    vm.refresh = function () {
      $state.go($state.current, {}, {
        reload: true
      });
    };

    function getPermissions() {
      permissionsService.getPermissions(function (permissions) {
        vm.permissions = permissions;
      });
    }

    function initialize() {
      getPermissions();
    }

    initialize();
  };

  /* global angular, APP_NAME */

  angular.module(APP_NAME).controller('homeCtrl', homeCtrl);

  homeCtrl.$inject = ['$filter', '$state', '$scope', '$mdSidenav', '$mdMedia', '$q', 'eventsService', 'playersService', 'seasonsService', 'statsService', 'venuesService', 'gamesService', 'permissionsService', 'authApiService', 'authService'];
}

{
  var loginCtrl = function loginCtrl($state, authApiService, historyService) {

    var vm = this;

    vm.login = function () {
      authApiService.api().login(vm.user, function (user) {
        historyService.goPrevious();
      });
    };

    vm.cancel = function () {
      historyService.goPrevious();
    };

    function initialize() {}

    initialize();
  };

  angular.module(APP_NAME).controller('loginCtrl', loginCtrl);

  loginCtrl.$inject = ['$state', 'authApiService', 'historyService'];
}

{
  var playersCtrl = function playersCtrl($filter, $state, $mdMedia, permissionsService, RHP_ENTITY_TYPE) {
    console.log('brah');
    var vm = this;

    vm.ENTITY_TYPE = RHP_ENTITY_TYPE;
    vm.mdMedia = $mdMedia;

    function getPermissions() {
      permissionsService.getPermissions(function (permissions) {
        vm.permissions = permissions;
      });
    }

    function initialize() {
      getPermissions();
    }

    initialize();
  };

  angular.module(APP_NAME).controller('playersCtrl', playersCtrl);

  playersCtrl.$inject = ['$filter', '$state', '$mdMedia', 'permissionsService', 'RHP_ENTITY_TYPE'];
}

{
  var playersListCtrl = function playersListCtrl($state, playersService) {

    var vm = this;

    vm.newPlayer = function () {
      $state.transitionTo('players.manage');
    };

    vm.getPlayers = function () {
      vm.players = playersService.api().query();
    };

    vm.editPlayer = function (player) {
      $state.transitionTo('players.manage', {
        id: player._id
      });
    };

    vm.viewPlayer = function (player) {
      $state.transitionTo('players.view', {
        id: player._id
      });
    };

    vm.removePlayer = function (player) {
      playersService.api(player._id).remove(function () {
        vm.getPlayers();
      });
    };

    function initialize() {
      vm.getPlayers();
    }

    initialize();
  };

  /* global angular, APP_NAME */
  angular.module(APP_NAME).controller('playersListCtrl', playersListCtrl);

  playersListCtrl.$inject = ['$state', 'playersService'];
}

{
  var playersManageCtrl = function playersManageCtrl($filter, $state, $stateParams, playersService, historyService) {

    var vm = this;

    vm.getPlayer = function (id) {
      vm.player = playersService.api(id).get();
    };

    vm.save = function () {
      playersService.api().save(vm.player, function () {
        $state.transitionTo('players.list');
      });
    };

    vm.cancel = function () {
      historyService.goPrevious();
    };

    function initialize() {
      if ($stateParams.id) {
        vm.getPlayer($stateParams.id);
      }
    }

    initialize();
  };

  angular.module(APP_NAME).controller('playersManageCtrl', playersManageCtrl);

  playersManageCtrl.$inject = ['$filter', '$state', '$stateParams', 'playersService', 'historyService'];
}

{
  var playersViewCtrl = function playersViewCtrl($filter, $state, $stateParams, playersService, statsService) {

    var vm = this;

    vm.getPlayer = function (id) {
      vm.player = statsService.api(id).player(function () {
        if (!vm.player._id) {
          vm.player = playersService.api(id).get();
        }
      });
    };

    vm.shoutOut = function (id) {
      playersService.api(id).shoutOut(function (data) {
        vm.player.shoutOuts = data.shoutOuts;
      });
    };

    vm.save = function () {
      playersService.api().save(vm.player, function () {
        $state.transitionTo('players.list');
      });
    };

    vm.removePlayer = function (player) {
      playersService.api(player._id).remove(function () {
        $state.transitionTo('players.list');
      });
    };

    function initialize() {
      if ($stateParams.id) {
        vm.getPlayer($stateParams.id);
      }
    }

    initialize();
  };

  angular.module(APP_NAME).controller('playersViewCtrl', playersViewCtrl);

  playersViewCtrl.$inject = ['$filter', '$state', '$stateParams', 'playersService', 'statsService'];
}

{
  var registerCtrl = function registerCtrl($state, usersService) {

    var vm = this;

    vm.register = function () {
      usersService.api().save(vm.user, function () {
        $state.transitionTo('home'); //change to 'admin console' when the time comes
      });
    };

    function initialize() {}

    initialize();
  };

  angular.module(APP_NAME).controller('registerCtrl', registerCtrl);

  registerCtrl.$inject = ['$state', 'usersService'];
}

{
  var seasonsCtrl = function seasonsCtrl($filter, $state, permissionsService) {

    var vm = this;

    function getPermissions() {
      permissionsService.getPermissions(function (permissions) {
        vm.permissions = permissions;
      });
    }

    function initialize() {
      getPermissions();
    }

    initialize();
  };

  /* global angular, APP_NAME */
  angular.module(APP_NAME).controller('seasonsCtrl', seasonsCtrl);

  seasonsCtrl.$inject = ['$filter', '$state', 'permissionsService'];
}

{
  var _gamesViewCtrl = function _gamesViewCtrl($state, $stateParams, seasonsService) {

    var vm = this;

    vm.newSeason = function () {
      var seasonNumber;
      if (vm.seasons && vm.seasons.length) {
        seasonNumber = vm.seasons[0].seasonNumber + 1;
      } else {
        seasonNumber = 1;
      }
      vm.season = seasonsService.api(seasonNumber).save(function () {
        vm.getSeason();
      });
    };

    vm.getSeason = function (id) {
      if (id) {
        vm.season = seasonsService.api(id).get();
      } else {
        vm.seasons = seasonsService.api().query(function (data) {});
      }
    };

    function initialize() {
      vm.getSeason($stateParams.id);
    }

    initialize();
  };

  angular.module(APP_NAME).controller('seasonsViewCtrl', _gamesViewCtrl);

  _gamesViewCtrl.$inject = ['$state', '$stateParams', 'seasonsService'];
}

{
  var statsCtrl = function statsCtrl($filter, $state, statsService, usersService, playersService, venuesService, seasonsService) {

    var vm = this;

    function getSeasons() {
      vm.seasons = seasonsService.api().query(function () {
        vm.currentSeason = vm.seasons[0];
      });
    }

    function initialize() {
      getSeasons();
    }

    initialize();
  };

  angular.module(APP_NAME).controller('statsCtrl', statsCtrl);

  statsCtrl.$inject = ['$filter', '$state', 'statsService', 'usersService', 'playersService', 'venuesService', 'seasonsService'];
}

{
  var statsPlayersCtrl = function statsPlayersCtrl($filter, $state, $stateParams, statsService, usersService, playersService) {

    var vm = this;

    vm.shoutOut = function (id) {
      playersService.api(id).shoutOut(function (data) {
        vm.player.shoutOuts = data.shoutOuts;
      });
    };

    function initialize() {
      if ($stateParams.id) {
        vm.playerStats = statsService.api($stateParams.id).seasons();
      } else {
        vm.playerStats = statsService.api().players();
      }
    }

    initialize();
  };

  angular.module(APP_NAME).controller('statsPlayersCtrl', statsPlayersCtrl);

  statsPlayersCtrl.$inject = ['$filter', '$state', '$stateParams', 'statsService', 'usersService', 'playersService'];
}

{
  var venuesCtrl = function venuesCtrl($filter, $state, $stateParams, $mdMedia, permissionsService, RHP_ENTITY_TYPE) {

    var vm = this;

    vm.mdMedia = $mdMedia;
    vm.ENTITY_TYPE = RHP_ENTITY_TYPE;

    function getPermissions() {
      permissionsService.getPermissions(function (permissions) {
        vm.permissions = permissions;
      });
    }

    function initialize() {
      getPermissions();
    }

    initialize();
  };

  /* global angular, APP_NAME */
  angular.module(APP_NAME).controller('venuesCtrl', venuesCtrl);

  venuesCtrl.$inject = ['$filter', '$state', '$stateParams', '$mdMedia', 'permissionsService', 'RHP_ENTITY_TYPE'];
}

{
  var venuesListCtrl = function venuesListCtrl($filter, $state, $stateParams, venuesService, permissionsService) {

    var vm = this;

    vm.errors = [];

    vm.getVenues = function () {
      vm.venues = venuesService.api().query();
    };

    vm.newVenue = function () {
      $state.transitionTo('venues.manage');
    };

    vm.viewVenue = function (venue) {
      $state.transitionTo('venues.view', {
        id: venue._id
      });
    };

    vm.editVenue = function (venue) {
      $state.transitionTo('venues.manage', {
        id: venue._id
      });
    };

    vm.removeVenue = function (venue) {
      venuesService.api(venue._id).remove(function () {
        vm.getVenues();
      });
    };

    function initialize() {
      vm.getVenues();
      $stateParams.reason ? vm.errors.push($stateParams.reason) : angular.noop;
    }

    initialize();
  };

  angular.module(APP_NAME).controller('venuesListCtrl', venuesListCtrl);

  venuesListCtrl.$inject = ['$filter', '$state', '$stateParams', 'venuesService', 'permissionsService'];
}

{
  var venuesManageCtrl = function venuesManageCtrl($filter, $state, $stateParams, venuesService, playersService, historyService) {

    var vm = this;

    vm.venue = {};
    vm.directors = [];

    vm.days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    vm.getDirectors = function () {
      vm.directors = playersService.api().findBy({
        isTd: true
      });
    };

    vm.newVenue = function () {
      vm.resetVenue();
      $state.transitionTo('venues.manage');
    };

    vm.resetVenue = function () {
      vm.venue = {};
    };

    vm.cancel = function () {
      historyService.goPrevious();
    };

    vm.save = function () {
      venuesService.api().save(vm.venue, function () {
        $state.go('venues.list');
      });
    };

    vm.getVenue = function (id) {
      venuesService.api(id).get(function (venue) {
        venue.td = $filter('filter')(vm.directors, {
          _id: venue.td._id
        })[0];
        vm.venue = venue;
      });
    };

    vm.removeVenue = function (venue) {
      venuesService.api(venue._id).remove(function () {
        $state.go('venues.list');
      });
    };

    function initialize() {
      vm.getDirectors();
      if ($stateParams.id) {
        vm.getVenue($stateParams.id);
      }
    }

    initialize();
  };

  angular.module(APP_NAME).controller('venuesManageCtrl', venuesManageCtrl);

  venuesManageCtrl.$inject = ['$filter', '$state', '$stateParams', 'venuesService', 'playersService', 'historyService'];
}

{
  var venuesViewCtrl = function venuesViewCtrl($filter, $state, $stateParams, venuesService, playersService) {

    var vm = this;

    vm.venue = {};

    vm.getVenue = function (id) {
      vm.venue = venuesService.api(id).get();
    };

    vm.removeVenue = function (venue) {
      venuesService.api(venue._id).remove(function () {
        $state.go('venues.list');
      });
    };

    function initialize() {
      if ($stateParams.id) {
        vm.getVenue($stateParams.id);
      }
    }

    initialize();
  };

  angular.module(APP_NAME).controller('venuesViewCtrl', venuesViewCtrl);

  venuesViewCtrl.$inject = ['$filter', '$state', '$stateParams', 'venuesService', 'playersService'];
}

{
  var rhpListDirective = function rhpListDirective($mdMedia) {

    var rhpListTemplate = ['<md-content layout="column">', //
    '  <md-button class="md-secondary" ng-disabled="list.listIndex == 0" aria-label="last-five-list" ng-click="list.last5()">', //
    '    Last 5 list', //
    '  </md-button>', //
    '  <md-list class="md-dense" ng-class="{ \'rhp-dense-list\':list.mdMedia(\'xs\') }" ng-repeat="item in list.list | limitTo:5:list.listIndex">', //
    '    <md-list-item class="md-3-line md-hue-1" ng-click="list.setItem({item : item})">', //
    '      <div class="md-list-item-text">', //
    '        <h3 ng-if="item.name">{{item.name}}</h3>', //  TODO - Figure out how to standardize
    '        <h3 ng-if="item.venue">{{item.venue.name}}</h3>', //
    '        <p>{{item.day ? item.day : (item.date | date:\'fullDate\') + \' \' + (item.date | date:\'shortTime\')}}</p>', //     TODO - this based on a scope import
    '        <p ng-if="item.td">{{item.td.name}}</p>', // TODO - from the directive attribute
    '        <p ng-if="item.isTd">{{item.isTd ? \'Tournament Director\' : \'\'}}</p>', //
    '      </div>', //
    '      <md-button class="md-warn md-icon-button" ng-click="list.editItem({item : item})" ng-if="list.canEdit(list.entityType)">', //
    '        <md-icon md-font-set="material-icons">edit</md-icon>', //
    '      </md-button>', //
    '      <md-button class="md-warn md-icon-button" ng-click="list.removeItem({item : item}); $event.stopPropagation()" ng-if="list.canDelete(list.entityType)">', //
    '        <md-icon md-font-set="material-icons">clear</md-icon>', //
    '      </md-button>', //
    '    </md-list-item>', //
    '  </md-list>', //
    '  <md-button class="md-secondary" aria-label="more-list" ng-click="list.list.length > list.listIndex + 5 ? list.next5() : list.first5()">', //
    '    {{ list.list.length > list.listIndex + 5 ? \'And \' + (list.list.length - list.listIndex - 5) + \' more...\' : \'Back to Start\' }}', //
    '  </md-button>', //
    '</md-content>'].join('');

    var directive = {
      restrict: 'E',
      template: rhpListTemplate,
      scope: {
        list: '=ngModel',
        size: '=rhpListSize',
        setItem: '&rhpListSet',
        editItem: '&rhpListEdit',
        removeItem: '&rhpListDel',
        entityType: '='
      },
      bindToController: true,
      controller: ctrlFn,
      controllerAs: 'list'
    };

    return directive;

    ctrlFn.$inject = ['$scope', '$mdMedia', '$timeout', 'permissionsService', 'RHP_ENTITY_TYPE'];

    function ctrlFn($scope, $mdMedia, $timeout, permissionsService, RHP_ENTITY_TYPE) {

      var vm = this;

      vm.mdMedia = $mdMedia;
      vm.permissions = {};

      var userPermissions = {};

      function getPermissions() {
        permissionsService.getPermissions(function (permissions) {
          userPermissions = permissions;
        });
      }

      vm.canEdit = function (entityType) {
        switch (entityType) {
          case RHP_ENTITY_TYPE.PLAYER:
            return userPermissions.EDIT_PLAYER;
          case RHP_ENTITY_TYPE.VENUE:
            return userPermissions.EDIT_VENUE;
          case RHP_ENTITY_TYPE.EVENT:
            return userPermissions.EDIT_EVENT;
          default:
            return false;
        }
      };

      vm.canDelete = function (entityType) {
        switch (entityType) {
          case RHP_ENTITY_TYPE.PLAYER:
            return userPermissions.DELETE_PLAYER;
          case RHP_ENTITY_TYPE.VENUE:
            return userPermissions.DELETE_VENUE;
          case RHP_ENTITY_TYPE.EVENT:
            return userPermissions.DELETE_EVENT;
          default:
            return false;
        }
      };

      function initialize() {
        vm.first5();
        getPermissions();
      }

      vm.next5 = function () {
        vm.listIndex += vm.size;
      };

      vm.last5 = function () {
        vm.listIndex += -vm.size;
      };

      vm.first5 = function () {
        vm.listIndex = 0;
      };

      initialize();
    }
  };

  angular.module(APP_NAME).directive('rhpList', rhpListDirective);

  rhpListDirective.$inject = ['$mdMedia'];
}

{
  var rhpTabs = function rhpTabs() {

    var rhpTabsTemplate = ['<md-tabs ng-show="tabs.tabVisibility()" md-stretch-tabs="always" class="md-primary md-fixed" md-selected="tabs.selectedTab">', //
    '  <md-tab ng-click="tabs.tabPath(tab.path)" ng-repeat="tab in tabs.tabs">', //
    '    <md-tab-label>{{tab.name}}</md-tab-label>', //
    '  </md-tab>', //
    '</md-tabs>' //
    ].join('');

    var directive = {
      restrict: 'E',
      template: rhpTabsTemplate,
      scope: {},
      bindToController: true,
      controller: rhpTabsController,
      controllerAs: 'tabs'
    };
    return directive;

    rhpTabsController.$inject = ['$scope', '$state', '$filter', '$timeout', '$stateParams', 'permissionsService'];

    function rhpTabsController($scope, $state, $filter, $timeout, $stateParams, permissionsService) {

      var vm = this;

      vm.tabs = [];

      vm.tabVisibility = function () {
        var currentState = $state.current.name.split('.')[1];
        return currentState !== 'list' && !(currentState === 'manage' && !$stateParams.id);
      };

      vm.tabPath = function (path) {
        var pathArray = path.split('.');

        if ($stateParams.id) {
          $state.transitionTo(path, {
            id: $stateParams.id
          });
        } else if (pathArray[1] === 'list') {
          $state.transitionTo(path);
        }
      };

      function buildTabArray(state) {

        vm.tabs = [];
        var parent = state.parent;
        if (parent === 'home') return;

        var tabsTypes = ['List', 'View'];

        if (addManageTab(state.parent)) {
          tabsTypes.push('Manage');
        }

        angular.forEach(tabsTypes, function (type) {
          var path = parent + '.' + type.toLowerCase();
          var tab = {
            name: type,
            path: path
          };

          vm.tabs.push(tab);
        });

        setActiveTab(state);
      }

      function setActiveTab(state) {

        var activeTab = $filter('filter')(vm.tabs, {
          path: state.name
        })[0];

        vm.selectedTab = vm.tabs.indexOf(activeTab);
      }

      function addManageTab(entity) {
        var permission;

        switch (entity.toUpperCase()) {
          case 'EVENTS':
            permission = 'EDIT_EVENT';
            break;
          case 'VENUES':
            permission = 'EDIT_VENUE';
            break;
          case 'PLAYERS':
            permission = 'EDIT_PLAYER';
            break;
          default:
            return false;

        }
        return permissionsService.checkPermissions([permission]);
      }

      $scope.$watch(function () {
        return $state.current;
      }, function (n, o) {
        if (n.parent == o.parent && vm.tabs.length && n.parent != 'home') {
          setActiveTab(n);
        } else {
          buildTabArray(n);
        }
      });

      function initialize() {}

      initialize();
    }
  };

  /* global angular, APP_NAME */
  angular.module(APP_NAME).directive('rhpTabs', rhpTabs);

  rhpTabs.$inject = [];
}

{
  var authProvider = function authProvider($http, $q, authService, permissionsService) {

    var basePath = '/api/auth';

    var service = {
      isLoggedIn: isLoggedIn,
      authWithPermissions: authWithPermissions,
      authWithPermissionsPassParams: authWithPermissionsPassParams
    };

    return service;

    function authFailure() {
      authService.authenticate(false);
      permissionsService.clearPermissions();
    }

    /**
     * @private  {function}         resolveRedirect
     *
     * @description                 dynamically determines whether to resolve or
     *   reject the promise
     *
     * @param  {object} deferred    the $q.defer() object
     * @param  {object} promise     the promise to resolve or reject
     * @param  {boolean} onSuccess  determines whether to resolve or reject the promise
     *
     * @returns {object}            the $q.defer() object, resolved or rejected
     */
    function resolveRedirect(deferred, promise, onSuccess) {
      return onSuccess ? deferred.resolve({}) : deferred.reject(promise);
    }

    /**
     * @public  {function}           isLoggedIn
     *
     * @description                  checks if the user is logged in, and performs
     *   a redirect if they are not. With the @param onSuccess boolean, the redirect
     *   is performed <em>if</em> the user <em>is</em> logged in
     *
     * @param  {object} redirectTo   the angular $state uri to redirect to
     * @param  {boolean} onSuccess   perform redirect when user <em>is</em> logged in
     *
     * @returns  {object}            the promise containing the authorization state
     *   and potentially a redirect for the $state
     */
    function isLoggedIn(redirectTo, onSuccess) {
      var deferred = $q.defer();
      $http.get(basePath).then(function () {
        var promise = {
          redirectTo: redirectTo,
          code: 'User is authenticated'
        };
        deferred = resolveRedirect(deferred, promise, !onSuccess);
      }, function (err) {
        authFailure();
        var promise = {
          redirectTo: redirectTo,
          code: err.data.code
        };
        deferred = resolveRedirect(deferred, promise, onSuccess);
      });

      return deferred.promise;
    }

    /**
     * @public {function}             authWithPermissions
     *
     * @description                   performs a redirect if the user does
     *   not pass the authorization check with the given permissions
     *
     * @param  {object} redirectTo    the angular $state uri to redirect to
     * @param  {array} permissions    an array of permission names
     *
     * @returns  {object}             the promise containing the authorization
     *   state and a potential redirect
     */
    function authWithPermissions(redirectTo, permissions) {
      return authWithPermissionsPassParams(redirectTo, null, permissions);
    }

    /**
     * @public {function}                 authWithPermissionsPassParams
     *
     * @description                       perform a redirect to an
     *   angular $state requiring a param (e.g. :id) if the user does
     *   not pass the authorization check with the given permissions
     *
     * @param  {object} redirectTo        the angular $state uri to redirect to
     * @param  {object} redirectParams    the parameters to pass to the $state uri
     * @param  {array} permissions        an array of permission names
     * @returns  {object}                 the promise containing the authorization
     *   state and a potential redirect
     */
    function authWithPermissionsPassParams(redirectTo, redirectParams, permissions) {
      var deferred = $q.defer();
      $http.post(basePath + '/permission', {
        permissions: permissions
      }).then(function () {
        deferred.resolve({});
      }, function (err) {
        authFailure();
        deferred.reject({
          redirectTo: redirectTo,
          redirectParams: redirectParams,
          code: err.data.code
        });
      });
      return deferred.promise;
    }
  };

  /* global angular, APP_NAME */
  angular.module(APP_NAME).service('authProvider', authProvider);

  authProvider.$inject = ['$http', '$q', 'authService', 'permissionsService'];
}

{
  var authApiService = function authApiService($resource, authService, permissionsService) {

    var basePath = '/api/auth';

    var service = {
      api: api
    };

    return service;

    /////////////////////

    function api(id) {
      return $resource(basePath + '/:action', {
        id: id
      }, {
        'login': {
          method: 'POST',
          params: {
            action: 'login'
          },
          transformResponse: function transformResponse(data, headers, status) {
            authService.authenticate(status === 200);
            if (authService.isAuth()) {
              permissionsService.setPermissions();
            }
            return angular.fromJson(data);
          }
        },
        'logout': {
          method: 'GET',
          params: {
            action: 'logout'
          },
          transformResponse: function transformResponse(data) {
            authService.authenticate(false);
            permissionsService.clearPermissions();
            return angular.fromJson(data);
          }
        }
      });
    }
  };

  /* global angular, APP_NAME */
  angular.module(APP_NAME).factory('authApiService', authApiService);

  authApiService.$inject = ['$resource', 'authService', 'permissionsService'];
}

{
  var authService = function authService() {

    var isAuthenticated;

    var service = {
      isAuth: isAuth,
      hasAuthenticated: hasAuthenticated,
      authenticate: authenticate
    };

    return service;

    /////////////////////

    function hasAuthenticated() {
      return isAuthenticated !== undefined;
    }

    function isAuth() {
      return !!isAuthenticated;
    }

    function authenticate(authState) {
      isAuthenticated = false || !!authState;
    }
  };

  /* global angular, APP_NAME */
  angular.module(APP_NAME).factory('authService', authService);

  authService.$inject = [];
}

{
  var eventsService = function eventsService($resource) {

    var basePath = '/api/events';

    var service = {
      api: api
    };

    return service;

    /////////////////////

    function api(id) {
      return $resource(basePath + '/:id/:action', {
        id: id
      }, {
        'count': {
          method: 'GET',
          params: {
            action: 'count'
          }
        }
      });
    }
  };

  angular.module(APP_NAME).factory('eventsService', eventsService);

  eventsService.$inject = ['$resource'];
}

{
  var gamesService = function gamesService($resource) {

    var basePath = '/api/games';

    var service = {
      api: api
    };

    return service;

    /////////////////////

    function api(id) {
      return $resource(basePath + '/:id', {
        id: id
      }, {
        'create': {
          method: 'POST'
        },
        'save': {
          method: 'POST',
          params: {
            id: null
          }
        }
      });
    }
  };

  /* global angular, APP_NAME */
  angular.module(APP_NAME).factory('gamesService', gamesService);

  gamesService.$inject = ['$resource'];
}

{
  var historyService = function historyService($rootScope, $state) {

    var service = {
      goPrevious: goPrevious,
      pushState: pushState
    };

    var stateHistory = [];

    function goPrevious() {
      var previousState = stateHistory[stateHistory.length - 1];
      previousState = !previousState ? {
        state: 'home',
        params: {}
      } : previousState;
      $state.go(previousState.state, previousState.params);
    }

    function pushState(fromState, fromParams) {
      stateHistory.push({
        state: fromState,
        params: fromParams
      });
    }

    return service;
  };

  angular.module(APP_NAME).factory('historyService', historyService);

  historyService.$inject = ['$rootScope', '$state'];
}

{
  var homeService = function homeService() {};

  angular.module(APP_NAME).factory('homeService', homeService);

  homeService.$inject = [];
}

{
  var permissionsService = function permissionsService($resource, $timeout, authService) {

    var basePath, permissions;

    basePath = '/api/auth/permissions';

    permissions = {};

    var service = {
      getPermissions: getPermissions,
      setPermissions: setPermissions,
      checkPermissions: checkPermissions,
      clearPermissions: clearPermissions
    };

    setPermissions();

    return service;

    //////////////////

    function api(id) {
      return $resource(basePath, {
        id: id
      }, {
        'get': {
          method: 'GET',
          transformResponse: function transformResponse(data, headers, status) {
            authService.authenticate(status === 200);
            return angular.fromJson(data);
          }
        }
      });
    }

    function getPermissionsFromMemory(PERMISSIONS_ATTEMPT_COUNT, cb) {
      var interval, AUTHENTICATION_STATUS, PERMISSIONS_MAX_ATTEMPTS, PERMISSIONS_INVALID, PERMISSIONS_POPULATED;

      interval = 1000;
      PERMISSIONS_MAX_ATTEMPTS = 10;
      AUTHENTICATION_STATUS = !authService.hasAuthenticated() || authService.hasAuthenticated() && authService.isAuth();
      PERMISSIONS_POPULATED = !!Object.keys(permissions).length;
      PERMISSIONS_INVALID = PERMISSIONS_ATTEMPT_COUNT === PERMISSIONS_MAX_ATTEMPTS;

      PERMISSIONS_ATTEMPT_COUNT++;
      if ((!permissions || !PERMISSIONS_POPULATED) && AUTHENTICATION_STATUS && !PERMISSIONS_INVALID) {
        $timeout(function () {
          getPermissionsFromMemory(PERMISSIONS_ATTEMPT_COUNT, cb);
        }, interval);
      } else if (cb && typeof cb === 'function') {
        return cb(permissions);
      }
    }

    function getPermissions(cb) {
      var PERMISSIONS_ATTEMPT_COUNT = 0;

      return getPermissionsFromMemory(PERMISSIONS_ATTEMPT_COUNT, cb);
    }

    function setPermissions() {
      api().get(function (data) {
        permissions = data;
      });
    }

    function checkPermission(requiredPermission) {
      return permissions[requiredPermission];
    }

    function checkPermissions(requiredPermissions) {
      for (var i in requiredPermissions) {
        if (!checkPermission(requiredPermissions[i])) {
          return false;
        }
      }
      return true;
    }

    function clearPermissions() {
      permissions = {};
    }
  };

  /* global angular, APP_NAME */
  angular.module(APP_NAME).factory('permissionsService', permissionsService);

  permissionsService.$inject = ['$resource', '$timeout', 'authService'];
}

{
  var playersService = function playersService($resource) {

    var basePath = '/api/players';

    var service = {
      api: api
    };

    return service;

    /////////////////////

    function api(id) {
      return $resource(basePath + '/:id/:action', {
        id: id
      }, {
        'findBy': {
          method: 'PUT',
          isArray: true
        },
        'notIn': {
          method: 'PUT',
          params: {
            action: 'notIn'
          },
          isArray: true
        },
        'shoutOut': {
          method: 'PUT',
          params: {
            action: 'shoutOut'
          }
        },
        'count': {
          method: 'GET',
          params: {
            action: 'count'
          }
        }
      });
    }
  };

  angular.module(APP_NAME).factory('playersService', playersService);

  playersService.$inject = ['$resource'];
}

{
  var seasonsService = function seasonsService($resource) {

    var basePath = '/api/seasons';

    var service = {
      api: api
    };

    return service;

    /////////////////////

    function api(id) {
      return $resource(basePath + '/:id/:action', {
        id: id
      }, {
        'findBy': {
          method: 'PUT',
          isArray: true
        },
        'notIn': {
          method: 'PUT',
          params: {
            action: 'notIn'
          },
          isArray: true
        }
      });
    }
  };

  angular.module(APP_NAME).factory('seasonsService', seasonsService);

  seasonsService.$inject = ['$resource'];
}

{
  var statsService = function statsService($resource) {
    var basePath = '/api/stats';

    var service = {
      api: api
    };

    return service;

    /////////////////////

    function api(id) {
      return $resource(basePath + '/:action/:id', {
        id: id
      }, {
        'player': {
          method: 'get',
          params: {
            action: 'players'
          }
        },
        'players': {
          method: 'get',
          params: {
            action: 'players'
          },
          isArray: true
        },
        'seasons': {
          method: 'get',
          params: {
            action: 'seasonalPlayers'
          },
          isArray: true
        }
      });
    }
  };

  angular.module(APP_NAME).factory('statsService', statsService);

  statsService.$inject = ['$resource'];
}

{
  var usersService = function usersService($resource) {

    var basePath = '/api/users';

    var service = {
      api: api
    };

    return service;

    /////////////////////

    function api(id) {
      return $resource(basePath + '/:action', {
        id: id
      });
    }
  };

  angular.module(APP_NAME).factory('usersService', usersService);

  usersService.$inject = ['$resource'];
}

{
  var venuesService = function venuesService($resource) {

    var basePath = '/api/venues';

    var service = {
      api: api
    };

    return service;

    /////////////////////

    function api(id) {
      return $resource(basePath + '/:id/:action', {
        id: id
      }, {
        'count': {
          method: 'GET',
          params: {
            action: 'count'
          }
        }
      });
    }
  };

  angular.module(APP_NAME).factory('venuesService', venuesService);

  venuesService.$inject = ['$resource'];
}

{
  /* global angular, APP_NAME */
  angular.module(APP_NAME).config(['$stateProvider', function ($stateProvider) {

    $stateProvider.state('login', {
      url: 'login',
      parent: 'home',
      templateUrl: '/views/login.html',
      controller: 'loginCtrl',
      controllerAs: 'lg',
      resolve: {
        auth: ['authProvider', function (authProvider) {
          return authProvider.isLoggedIn('home', true);
        }]
      }
    }).state('register', {
      url: 'register',
      parent: 'home',
      templateUrl: '/views/register.html',
      controller: 'registerCtrl',
      controllerAs: 'rg',
      resolve: {
        auth: ['authProvider', function (authProvider) {
          return authProvider.isLoggedIn('home', true);
        }]
      }
    });
  }]);
}

{
  /* global angular, APP_NAME */
  angular.module(APP_NAME).config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.when('/events', '/events/list');

    $stateProvider.state('events', {
      url: 'events',
      parent: 'home',
      templateUrl: '/views/events.html',
      controller: 'eventsCtrl',
      controllerAs: 'events',
      redirectTo: 'events.list'
    }).state('events.list', {
      url: '/list',
      parent: 'events',
      templateUrl: '/views/events.list.html',
      controller: 'eventsListCtrl',
      controllerAs: 'el'
    }).state('events.manage', {
      url: '/manage/:id',
      parent: 'events',
      templateUrl: '/views/events.manage.html',
      controller: 'eventsManageCtrl',
      controllerAs: 'em',
      resolve: {
        auth: ['authProvider', '$stateParams', function (authProvider, $stateParams) {
          var permissions = [];
          permissions.push($stateParams.id ? 'EDIT_EVENT' : 'ADD_EVENT');
          return authProvider.authWithPermissions('events.list', permissions);
        }]
      }
    }).state('events.view', {
      url: '/view/:id',
      parent: 'events',
      templateUrl: '/views/events.view.html',
      controller: 'eventsViewCtrl',
      controllerAs: 'ev'
    });
  }]);
}

{
  /* global angular, APP_NAME */
  angular.module(APP_NAME).config(['$stateProvider', function ($stateProvider) {

    $stateProvider.state('games', {
      url: 'games',
      parent: 'home',
      templateUrl: '/views/games.html',
      controller: 'gamesCtrl',
      controllerAs: 'games',
      redirectTo: 'games.play',
      abstract: true
    }).state('games.view', {
      url: '/view/:id',
      parent: 'games',
      templateUrl: '/views/games.view.html',
      controller: 'gamesViewCtrl',
      controllerAs: 'gv'
    }).state('games.play', {
      url: '/play/:id',
      parent: 'games',
      templateUrl: '/views/games.play.html',
      controller: 'gamesPlayCtrl',
      controllerAs: 'gp',
      resolve: {
        auth: ['authProvider', '$stateParams', function (authProvider, $stateParams) {
          return authProvider.authWithPermissionsPassParams('games.view', {
            id: $stateParams.id
          }, ['PLAY_GAME']);
        }]
      }
    }).state('games.players', {
      url: '/players',
      parent: 'games.play',
      templateUrl: '/views/games.players.html',
      controller: 'gamesPlayersCtrl',
      controllerAs: 'gp'
    }).state('games.players.add', {
      url: '/:gameId/players/add',
      parent: 'games',
      templateUrl: '/views/games.players.add.html',
      controller: 'gamesPlayersCtrl',
      controllerAs: 'gp',
      resolve: {
        auth: ['authProvider', '$stateParams', function (authProvider, $stateParams) {
          return authProvider.authWithPermissionsPassParams('games.view', {
            id: $stateParams.id
          }, ['ADD_PLAYER_TO_GAME']);
        }]
      }
    });
  }]);
}

{
  /* global angular, APP_NAME */
  angular.module(APP_NAME).config(['$urlRouterProvider', '$stateProvider', function ($urlRouterProvider, $stateProvider) {

    $urlRouterProvider.otherwise('/');

    $stateProvider.state('home', {
      url: '/',
      templateUrl: '/views/home.html',
      controller: 'homeCtrl',
      controllerAs: 'home'
    });
  }]).run(['$rootScope', '$state', 'authService', 'historyService', function ($rootScope, $state, authService, historyService) {
    $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
      if (!fromState.abstract) {
        historyService.pushState(fromState, fromParams);
      }
    });
    $rootScope.$on('$stateChangeError', function (evt, to, toParams, from, fromParams, error) {
      switch (error.code) {
        case 'NO_USER_FOUND':
          authService.authenticate(false);
          $state.go('login');
          break;
        case 'PERMISSIONS_INVALID':
          console.log('Redirect to ' + error.redirectTo + ' because ' + error.code);
          $state.transitionTo(error.redirectTo, {
            reason: error.code
          });
          break;
        default:
          console.error('No error code found, redirecting home', error);
          $state.go('home');
          break;
      }
    });
  }]);
}

{
  /* global angular, APP_NAME */
  angular.module(APP_NAME).config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.when('/players', '/players/list');

    $stateProvider.state('players', {
      url: 'players',
      parent: 'home',
      templateUrl: '/views/players.html',
      controller: 'playersCtrl',
      controllerAs: 'players',
      redirectTo: 'players.list'
    }).state('players.list', {
      url: '/list',
      parent: 'players',
      templateUrl: '/views/players.list.html',
      controller: 'playersListCtrl',
      controllerAs: 'pl'
    }).state('players.manage', {
      url: '/manage/:id',
      parent: 'players',
      templateUrl: '/views/players.manage.html',
      controller: 'playersManageCtrl',
      controllerAs: 'pm',
      resolve: {
        auth: ['authProvider', '$stateParams', function (authProvider, $stateParams) {
          var permissions = [];
          permissions.push($stateParams.id ? 'EDIT_PLAYER' : 'ADD_PLAYER');
          return authProvider.authWithPermissions('players.list', permissions);
        }]
      }
    }).state('players.view', {
      url: '/view/:id',
      parent: 'players',
      templateUrl: '/views/players.view.html',
      controller: 'playersViewCtrl',
      controllerAs: 'pv'
    });
  }]);
}

{
  {
    /* global angular, APP_NAME */
    angular.module(APP_NAME).config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

      $urlRouterProvider.when('/seasons', '/seasons/view');

      $stateProvider.state('seasons', {
        url: 'seasons',
        parent: 'home',
        templateUrl: '/views/seasons.html',
        controller: 'seasonsCtrl',
        controllerAs: 'seasons',
        redirectTo: 'seasons.view'
      }).state('seasons.view', {
        url: '/view',
        parent: 'seasons',
        templateUrl: '/views/seasons.view.html',
        controller: 'seasonsViewCtrl',
        controllerAs: 'vm'
      });
    }]);
  }
}

{
  /* global angular, APP_NAME */
  angular.module(APP_NAME).config(['$stateProvider', function ($stateProvider) {

    $stateProvider.state('stats', {
      url: 'stats',
      parent: 'home',
      templateUrl: '/views/stats.html',
      controller: 'statsCtrl',
      controllerAs: 'vm'
    }).state('stats.players', {
      url: '/players',
      parent: 'stats',
      templateUrl: '/views/stats.players.html',
      controller: 'statsPlayersCtrl',
      controllerAs: 'vm'
    }).state('stats.seasons', {
      url: '/seasons/:id',
      parent: 'stats',
      templateUrl: '/views/stats.players.html',
      controller: 'statsPlayersCtrl',
      controllerAs: 'vm'
    });
  }]);
}

{
  /* global angular, APP_NAME */
  angular.module(APP_NAME).config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.when('/venues', '/venues/list');

    $stateProvider.state('venues', {
      url: 'venues',
      parent: 'home',
      templateUrl: '/views/venues.html',
      controller: 'venuesCtrl',
      controllerAs: 'venues',
      redirectTo: 'venues.list'
    }).state('venues.list', {
      params: {
        reason: null
      },
      url: '/list',
      parent: 'venues',
      templateUrl: '/views/venues.list.html',
      controller: 'venuesListCtrl',
      controllerAs: 'vl'
    }).state('venues.manage', {
      url: '/manage/:id',
      parent: 'venues',
      templateUrl: '/views/venues.manage.html',
      controller: 'venuesManageCtrl',
      controllerAs: 'vm',
      resolve: {
        auth: ['authProvider', '$stateParams', function (authProvider, $stateParams) {
          var permissions = [];
          permissions.push($stateParams.id ? 'EDIT_VENUE' : 'ADD_VENUE');
          return authProvider.authWithPermissions('venues.list', permissions);
        }]
      }
    }).state('venues.view', {
      url: '/view/:id',
      parent: 'venues',
      templateUrl: '/views/venues.view.html',
      controller: 'venuesViewCtrl',
      controllerAs: 'vv'
    });
  }]);
}
