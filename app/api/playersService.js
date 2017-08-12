{
  function exports() {

    var Player = require('../models/player');

    var service = {
      getAllPlayers
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

    return service;

  }

  module.exports = exports;
}
