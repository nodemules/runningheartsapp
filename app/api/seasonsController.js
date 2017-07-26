{
  var express = require('express'),
    api = express.Router();

  var authService = require('./authService')(),
    seasonsService = require('./seasonsService')(),
    Permissions = require('../enum/permissions');

  api.post('/:seasonNumber', (req, res, next) => authService.checkPermissions(req, res, next, [Permissions.START_NEW_SEASON]), (req, res) => {
    seasonsService.startNewSeason(req.params.seasonNumber).then((season) => {
      res.send(season);
    });
  });

  api.get('/:seasonNumber', (req, res) => {
    seasonsService.getSeason(req.params.seasonNumber).then((seasons) => {
      res.send(seasons);
    });
  });

  api.get('/', (req, res) => {
    seasonsService.getSeasons().then((seasons) => {
      res.send(seasons);
    });
  });

  api.get('/latest', (req, res) => {
    seasonsService.getLatestSeason().then((season) => {
      res.send(season);
    });
  });


  module.exports = api;
}
