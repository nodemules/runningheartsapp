{
  function exports() {

    const LOG = require('../../config/logging').getLogger();

    var _ = require('lodash');

    var Season = require('../models/season'),
      Game = require('../models/game');
    var seasonsService = require('./seasonsService')();
    var playersService = require('./playersService')();
    var StatsMatcher = require('../matchers/statsMatchers')();
    const GlobalMatcher = StatsMatcher.GLOBAL;

    var service = {
      getSeasonStats,
      getPlayerStats,
      getAllPlayers,
      getAllPlayerStats,
      getSeasonPlayerStats,
      getWinners
    };

    function getSeasonStats(seasonNumber) {
      return new Promise((resolve, reject) => {
        seasonsService.getSeason(seasonNumber).then((season) => {

          var pipeline = [
            StatsMatcher.GET_SEASON_STATS.match(season.startDate, season.endDate),
            StatsMatcher.GET_SEASON_STATS.group,
            StatsMatcher.GET_SEASON_STATS.project
          ];

          Game
            .aggregate(pipeline)
            .exec(function(err, arr) {
              if (err) {
                LOG.error(err.stack);
                return reject(err);
              }
              var seasonWithStats = season;
              if (arr.length) {
                var stats = arr[0];
                delete stats._id;
                seasonWithStats = Object.assign(stats, season._doc);
              }
              return resolve(seasonWithStats);
            });
        }, reject);
      });
    }

    function getAllPlayers() {
      return new Promise((resolve, reject) => {
        playersService.getAllPlayers().then((players) => {
          getAllPlayerStats().then((playersWithStats) => {
            return resolve(_.unionBy(playersWithStats, players, (a) => {
              return _.find(players, {
                _id: a._id
              });
            }));
          }, reject);
        }, reject);
      });
    }

    function getAllPlayerStats() {
      return new Promise((resolve, reject) => {

        var project = {
          $project: Object.assign({}, GlobalMatcher.project.$project)
        };
        delete project.$project.bonusChips;

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
          GlobalMatcher.matchPlayer,
          project,
          StatsMatcher.GET_ALL_PLAYER_STATS.sortBy
        ];

        Game
          .aggregate(pipeline)
          .exec(function(err, players) {
            if (err) {
              LOG.error(err.stack);
              return reject(err);
            }
            resolve(players);
          });

      });
    }

    function getPlayerStats(playerId, season) {
      return new Promise((resolve, reject) => {

        var project = {
          $project: Object.assign({}, GlobalMatcher.project.$project)
        };
        if (!season) {
          delete project.$project.bonusChips;
        }
        project.$project.games = '$games';

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
              LOG.error(err.stack);
              return reject(err);
            }
            return resolve(players[0]);
          });
      });

    }

    function getSeasonPlayerStats(seasonNumber) {
      return new Promise((resolve, reject) => {

        Season
          .find({
            seasonNumber: seasonNumber
          })
          .exec(function(err, seasons) {
            if (err) {
              LOG.error(err);
              return reject(err);
            }

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
                  LOG.error(err.stack);
                  return reject(err);
                }
                return resolve(players);
              });
          });
      });
    }

    function getWinners(season) {
      return new Promise((resolve, reject) => {

        var pipeline = [
          GlobalMatcher.unwind,
          StatsMatcher.GET_WINNERS.match(season),
          GlobalMatcher.lookupEvent,
          GlobalMatcher.matchEvent,
          StatsMatcher.GET_WINNERS.group,
          GlobalMatcher.lookupPlayer,
          GlobalMatcher.unwindPlayer,
          StatsMatcher.GET_WINNERS.project,
          StatsMatcher.GET_WINNERS.sort,
          StatsMatcher.GET_WINNERS.limit
        ];

        Game
          .aggregate(pipeline)
          .exec(function(err, players) {
            if (err) {
              LOG.error(err.stack);
              return reject(err);
            }
            return resolve(calculateWinners(players));
          });
      });
    }

    function calculateWinners(players) {
      var winners = [];
      var scores = players.map((player) => {
        return player.totalPoints;
      });
      if (scores && scores.length) {
        var max = scores.reduce((a, b) => {
          return a > b ? a : b;
        });
        winners = players.filter((player) => {
          return player.totalPoints === max;
        });
      }
      return winners;
    }

    return service;
  }

  module.exports = exports;
}
