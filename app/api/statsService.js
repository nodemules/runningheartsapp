{
  function exports() {

    var Season = require('../models/season'),
      Game = require('../models/game');
    var StatsMatcher = require('../matchers/statsMatchers')();
    const GlobalMatcher = StatsMatcher.GLOBAL;

    var service = {
      getPlayerStats,
      getAllPlayerStats,
      getSeasonPlayerStats,
      getWinners
    }

    function getAllPlayerStats() {
      return new Promise((resolve, reject) => {

        var pipeline = [
          GlobalMatcher.unwind,
          StatsMatcher.GET_ALL_PLAYER_STATS.match(),
          GlobalMatcher.sort,
          GlobalMatcher.lookupEvent,
          GlobalMatcher.matchEvent,
          GlobalMatcher.unwindEvent,
          GlobalMatcher.lookupVenue,
          GlobalMatcher.unwindVenue,
          GlobalMatcher.group,
          GlobalMatcher.lookupPlayer,
          GlobalMatcher.unwindPlayer,
          GlobalMatcher.project,
          StatsMatcher.GET_ALL_PLAYER_STATS.sortBy
        ];

        Game
          .aggregate(pipeline)
          .exec(function(err, players) {
            if (err) {
              console.error(err.stack);
              return reject(err)
            }
            resolve(players);
          })

      })
    }

    function getPlayerStats(playerId, season) {
      return new Promise((resolve, reject) => {

        var project = {
          $project: Object.assign({}, GlobalMatcher.project.$project)
        }
        if (!season) {
          delete project.$project.bonusChips;
        }

        var pipeline = [
          GlobalMatcher.unwind,
          StatsMatcher.GET_PLAYER_STATS.match(playerId, season),
          GlobalMatcher.sort,
          GlobalMatcher.lookupEvent,
          GlobalMatcher.matchEvent,
          GlobalMatcher.unwindEvent,
          GlobalMatcher.lookupVenue,
          GlobalMatcher.unwindVenue,
          GlobalMatcher.group,
          GlobalMatcher.lookupPlayer,
          GlobalMatcher.unwindPlayer,
          project
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

    function getSeasonPlayerStats(seasonNumber) {
      return new Promise((resolve, reject) => {

        Season
          .find({
            seasonNumber: seasonNumber
          })
          .exec(function(err, seasons) {
            if (err) {
              console.log(err)
              return reject(err)
            }
            console.log(seasons)

            var season = seasons[0];

            var pipeline = [
              StatsMatcher.GET_SEASON_PLAYER_STATS.match(season.startDate, season.endDate),
              GlobalMatcher.unwind,
              GlobalMatcher.sort,
              GlobalMatcher.lookupEvent,
              GlobalMatcher.matchEvent,
              GlobalMatcher.unwindEvent,
              GlobalMatcher.lookupVenue,
              GlobalMatcher.unwindVenue,
              GlobalMatcher.group,
              GlobalMatcher.lookupPlayer,
              GlobalMatcher.unwindPlayer,
              GlobalMatcher.project,
              StatsMatcher.GET_SEASON_PLAYER_STATS.sortBy
            ];

            Game
              .aggregate(pipeline)
              .exec(function(err, players) {
                if (err) {
                  console.error(err.stack);
                  return reject(err)
                }
                return resolve(players);
              })
          })
      })
    }

    function getWinners(season) {
      return new Promise((resolve, reject) => {

        var pipeline = [
          StatsMatcher.GET_WINNERS.match(season),
          GlobalMatcher.unwind,
          StatsMatcher.GET_WINNERS.group,
          GlobalMatcher.lookupPlayer,
          GlobalMatcher.unwindPlayer,
          StatsMatcher.GET_WINNERS.project,
          StatsMatcher.GET_WINNERS.sort,
          StatsMatcher.GET_WINNERS.limit
        ]

        Game
          .aggregate(pipeline)
          .exec(function(err, players) {
            if (err) {
              console.error(err.stack);
              return reject(err);
            }
            return resolve(calculateWinners(players));
          })
      })
    }

    function calculateWinners(players) {
      var winners = [];
      var scores = players.map((player) => {
        return player.totalPoints
      })
      if (scores && scores.length) {
        var max = scores.reduce((a, b) => {
          return a > b ? a : b;
        })
        winners = players.filter((player) => {
          return player.totalPoints === max;
        })
      }
      return winners;
    }

    return service;
  }

  module.exports = exports;
}
