{
  function exports() {
    var moment = require('moment-timezone');
    var Season = require('../models/season');

    var service = {
      getSeasons,
      startNewSeason
    }

    function getSeasons() {
      return new Promise((resolve, reject) => {
        Season
          .find()
          .sort('-startDate')
          .exec((err, seasons) => {
            if (err) {
              console.log(err.stack);
              return reject(err);
            }
            return resolve(seasons);
          })
      })

    }

    function startNewSeason(seasonNumber) {
      return new Promise((resolve, reject) => {
        var time = moment().startOf('day').format();
        Season
          .findOneAndUpdate({
            seasonNumber: (seasonNumber - 1)
          }, {
            $set: {
              endDate: time
            }
          })
          .exec((err, season) => {
            if (err) {
              console.log(err.stack);
              return reject(err);
            }
            Season
              .create({
                seasonNumber: seasonNumber,
                startDate: time
              }, (err, season) => {
                if (err) {
                  console.log(err.stack);
                  return reject(err);
                }
                return resolve(season);
              })
          })

      })


    }

    return service;
  }

  module.exports = exports;
}
