{
  function exports() {
    var moment = require('moment-timezone');
    var Season = require('../models/season'),
      Game = require('../models/game');
    var StatsMatcher = require('../matchers/statsMatchers')();
    const GlobalMatcher = StatsMatcher.GLOBAL;

    var service = {
      getPlayerStats
    }

    function getPlayerStats(playerId) {
      return new Promise((resolve, reject) => {

        var pipeline = [
          GlobalMatcher.unwind,
          StatsMatcher.GET_PLAYER_STATS.match(playerId),
          GlobalMatcher.sort,
          GlobalMatcher.lookupEvent,
          GlobalMatcher.matchEvent,
          GlobalMatcher.unwindEvent,
          GlobalMatcher.lookupVenue,
          GlobalMatcher.unwindVenue,
          GlobalMatcher.group,
          GlobalMatcher.lookupPlayer,
          GlobalMatcher.unwindPlayer,
          GlobalMatcher.project
        ];

        Game
          .aggregate(pipeline)
          .exec(function(err, players) {
            if (err) {
              console.error(err.stack);
              return reject(err);
            }
            return resolve(players[0]);
          })
      })

    }




    return service;
  }

  module.exports = exports;
}
