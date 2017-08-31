{
  function exports() {

    const LOG = require('../../config/logging').getLogger();

    var moment = require('moment-timezone');
    var Season = require('../models/season');

    var service = {
      getLatestSeason,
      getSeason,
      getSeasons,
      startNewSeason
    };

    function getLatestSeason() {
      return new Promise((resolve, reject) => {
        getSeasons().then((seasons) => {
          return resolve(seasons[0]);
        }).catch((err) => {
          return reject(err);
        });
      });
    }

    function getSeason(seasonNumber) {
      return new Promise((resolve, reject) => {
        Season
          .find({
            seasonNumber: seasonNumber
          }).exec((err, seasons) => {
            if (err) {
              LOG.error(err);
              return reject(err);
            }
            return resolve(seasons[0]);
          });
      });
    }

    function getSeasons() {
      return new Promise((resolve, reject) => {
        Season
          .find()
          .sort('-startDate')
          .exec((err, seasons) => {
            if (err) {
              LOG.error(err.stack);
              return reject(err);
            }
            return resolve(seasons);
          });
      });

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
          .exec((err) => {
            if (err) {
              LOG.error(err.stack);
              return reject(err);
            }
            Season
              .create({
                seasonNumber: seasonNumber,
                startDate: time
              }, (err, season) => {
                if (err) {
                  LOG.error(err.stack);
                  return reject(err);
                }
                return resolve(season);
              });
          });

      });


    }

    return service;
  }

  module.exports = exports;
}
