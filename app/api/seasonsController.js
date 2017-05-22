{
  var express = require('express'),
    api = express.Router(),
    moment = require('moment-timezone');

  var authService = require('./authService')(),
    Permissions = require('../enum/permissions'),
    Seasons = require('../models/season');

  api.post('/:seasonNumber', (req, res, next) => authService.checkPermissions(req, res, next, [Permissions.START_NEW_SEASON]), (req, res) => {
    var time = moment().startOf('day').format();
    Seasons
      .findOneAndUpdate({
        seasonNumber: (req.params.seasonNumber - 1)
      }, {
        $set: {
          endDate: time
        }
      })
      .exec((err, season) => {
        if (err)
          console.log(err.stack);
        Seasons
          .create({
            seasonNumber: req.params.seasonNumber,
            startDate: time
          }, (err, season) => {
            if (err)
              console.log(err.stack);
            res.send(season);
          })
      })

  });

  api.get('/', (req, res) => {
    Seasons
      .find()
      .sort('-startDate')
      .exec((err, seasons) => {
        if (err)
          console.log(err.stack);
        res.send(seasons);
      })
  });


  module.exports = api;
}
