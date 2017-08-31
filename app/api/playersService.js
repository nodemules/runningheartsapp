{
  function exports() {

    const LOG = require('../../config/logging').getLogger();

    var Utils = require('../util/utils')();

    var Player = require('../models/player');

    var service = {
      getAllPlayers,
      createPlayer,
      updatePlayer,
      validatePlayerName
    };

    function getAllPlayers() {
      return new Promise((resolve, reject) => {

        Player
          .find({
            statusId: 1
          })
          .select('-statusId')
          .exec((err, players) => {
            if (err) {
              LOG.error(err.stack);
              return reject(err);
            }
            return resolve(players);
          });
      });
    }

    function updatePlayer(player) {
      return new Promise((resolve, reject) => {
        Player
          .findByIdAndUpdate(player._id, sanitizePlayerName(player), {
            'new': true
          })
          .select('-statusId')
          .exec((err, player) => {
            if (err) {
              LOG.error(err.stack);
              return reject({
                message: 'Error occurred updating a player',
                code: 'DATABASE_ERROR',
                status: 500
              });
            }
            return resolve(player);
          });

      });
    }

    function createPlayer(player) {
      return new Promise((resolve, reject) => {

        Player
          .create(sanitizePlayerName(player), (err, p) => {
            if (err) {
              if (err.code === 11000) {
                return reject({
                  message: `Player name [${player.name}] is taken`,
                  code: 'PLAYER_NAME_TAKEN'
                });
              }
              LOG.error(err.stack);
              return reject(err);
            }
            return resolve(p);
          });
      });
    }

    function validatePlayerName(player) {
      return new Promise((resolve, reject) => {
        if (!player || !player.name) {
          return reject({
            message: 'A Player name must be provided for validation.'
          });
        }

        sanitizePlayerName(player);

        Player
          .find({
            name: player.name
          })
          .exec((err, players) => {
            if (err) {
              LOG.error(err.stack);
              return reject({
                message: 'Error occurred validating Player name',
                code: 'DATABASE_ERROR',
                status: 500
              });
            }

            const PLAYER_NAME_AVAILABLE = {
              message: `Player name [${player.name}] is available`,
              code: 'PLAYER_NAME_AVAILABLE'
            };
            const PLAYER_NAME_TAKEN = {
              message: `Player name [${player.name}] is taken`,
              code: 'PLAYER_NAME_TAKEN'
            };

            if (players.length && !Utils.arrays(players).findById(player._id)) {
              return reject(PLAYER_NAME_TAKEN);
            }
            return resolve(PLAYER_NAME_AVAILABLE);
          });
      });
    }

    function sanitizePlayerName(player) {
      if (!player || !player.name) {
        return;
      }
      player.name = player.name.replace(/[^a-zA-Z ]+/g, '').replace(/\s\s+/g, ' ').trim();
      return player;
    }

    return service;

  }

  module.exports = exports;
}
