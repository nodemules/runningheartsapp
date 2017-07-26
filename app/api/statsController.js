{
  var express = require('express'),
    api = express.Router();

  var statsService = require('./statsService')();

  api.get('/players/:id', function(req, res) {
    statsService.getPlayerStats(req.params.id).then((player) => {
      res.send(player);
    })
  })

  api.get('/players', function(req, res) {
    statsService.getAllPlayerStats().then((players) => {
      res.send(players);
    })
  })

  api.get('/seasonalPlayers/:seasonNumber', function(req, res) {
    statsService.getSeasonPlayerStats(req.params.seasonNumber).then((players) => {
      res.send(players);
    })
  })

  api.get('/winners', function(req, res) {
    statsService.getWinners().then((winners) => {
      res.send(winners)
    })

  })

  module.exports = api;
}
