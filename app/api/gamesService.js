{
  function exports() {
    var moment = require('moment-timezone');
    var Game = require('../models/game');
    var service = {
      byDate
    }

    function byDate(startDate, endDate) {
      return new Promise(function(resolve, reject) {
        startDate = moment(startDate).startOf('day').format();
        if (!endDate) {
          endDate = startDate;
        }
        endDate = moment(endDate).endOf('day').format();

        var pOptions = [{
          path: 'event',
          select: 'venue td date',
          populate: [{
            path: 'venue',
            select: 'name day'
          }, {
            path: 'td',
            select: 'name user',
            populate: {
              path: 'user',
              model: 'User',
              select: 'username'
            }
          }]
        }]
        Game
          .find({
            startTime: {
              $gte: startDate,
              $lte: endDate
            },
            statusId: 1
          })
          .populate(pOptions)
          .select('-statusId')
          .exec(function(err, games) {
            if (err)
              return reject(err);
            return resolve(games);
          })
      })

    }

    return service;
  }

  module.exports = exports;
}
