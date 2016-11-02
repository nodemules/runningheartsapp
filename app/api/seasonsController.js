var express = require('express'),
  api = express.Router();

var Seasons = require('../models/season');

api.post('/:seasonNumber', function(req, res) {
  Seasons
    .create({
      seasonNumber: req.params.seasonNumber
    }, function(err, season) {
      if (err)
        console.log(err.stack);
      res.send(season);
    })
});

api.get('/', function(req, res) {
  Seasons
    .find()
    .sort('-startDate')
    .exec(function(err, seasons) {
      if (err)
        console.log(err.stack);
      res.send(seasons);
    })
});


module.exports = api;
