{
  function exports() {

    var Player = require('../models/player');

    var service = {
      getAllPlayers,
      createPlayer,
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

    function createPlayer(player) {
      return new Promise((resolve, reject) => {
        Player
          .create(player, (err, player) => {
            if (err) {
              console.log(err.stack);
              return reject(err);
            }
            return resolve(player);
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

    return service;

  }

  module.exports = exports;
}
