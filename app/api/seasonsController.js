{
  var express = require('express'),
    api = express.Router();

  var authService = require('./authService')(),
    seasonsService = require('./seasonsService')(),
    Permissions = require('../enum/permissions');

  const errorService = require('./advice/errorService')();

  api.post('/:seasonNumber',
    (req, res, next) => authService.checkPermissions(req, res, next, [Permissions.START_NEW_SEASON]),
    (req, res) => {
      seasonsService.startNewSeason(req.params.seasonNumber).then((season) => {
        res.send(season);
      }, (err) => errorService.handleError(res, err));
    });

  api.put('/:seasonNumber',
      (req, res, next) => authService.checkPermissions(req, res, next, [Permissions.EDIT_SEASON]),
      (req, res) => {
        seasonsService.persistSeason(req.body).then((season) => {
          res.send(season);
        }, (err) => errorService.handleError(res, err));
      });

  api.get('/date/:date', (req, res) => {
    seasonsService.getSeasonByEventDate(req.params.date).then((season) => {
      res.send(season);
    }, (err) => errorService.handleError(res, err));
  });

  api.get('/:seasonNumber', (req, res) => {
    seasonsService.getSeason(req.params.seasonNumber).then((seasons) => {
      res.send(seasons);
    }, (err) => errorService.handleError(res, err));
  });

  api.get('/', (req, res) => {
    seasonsService.getSeasons().then((seasons) => {
      res.send(seasons);
    }, (err) => errorService.handleError(res, err));
  });

  api.get('/latest', (req, res) => {
    seasonsService.getLatestSeason().then((season) => {
      res.send(season);
    }, (err) => errorService.handleError(res, err));
  });



  module.exports = api;
}
