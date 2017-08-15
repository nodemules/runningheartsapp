{
  function exports() {

    var Player = require('../models/player');

    var service = {
      getAllPlayers,
      createPlayer,
      updatePlayer,
      validatePlayerName
    }

    function getAllPlayers() {
      return new Promise((resolve, reject) => {

        Player
          .find({
            statusId: 1
          })
          .select('-statusId')
          .exec((err, players) => {
            if (err) {
              console.error(err.stack);
              return reject(err);
            }
            return resolve(players);
          })
      })
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
              console.log(err.stack);
              return reject({
                message: 'Error occurred updating a player',
                code: 'DATABASE_ERROR',
                status: 500
              });
            }
            return resolve(player);
          })

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
              console.log(err.stack);
              return reject(err);
            }
            return resolve(p);
          });
      })
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
              console.error(err.stack);
              return reject({
                message: 'Error occurred validating Player name',
                code: 'DATABASE_ERROR',
                status: 500
              });
            }
            if (players.length) {
              return reject({
                message: `Player name [${player.name}] is taken`,
                code: 'PLAYER_NAME_TAKEN'
              })
            }
            return resolve({
              message: `Player name [${player.name}] is available`,
              code: 'PLAYER_NAME_AVAILABLE'
            });
          })
      })
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
