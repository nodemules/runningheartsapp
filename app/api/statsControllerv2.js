var express = require('express'),
    api     = express.Router(),
    _       = require('lodash'),
   mongoose = require('mongoose');

var Venues  = require('../models/venue'),
    Users   = require('../models/user'),
    Players = require('../models/player'),
    Event   = require('../models/event'),
    Game    = require('../models/game');

api.get('/player/:id', function(req, res){

var project = {
  '$project': {
    'players': { $filter: { input: '$players', as: 'player', cond: { $eq: ['$$player.player', mongoose.Types.ObjectId(req.params.id)] } }}
  }
}

var match = {
  '$match': {
    'players': { $exists: true, $ne: [] }
  }
}
//outputs each value as an array with the value inside... why..?
var tidy = {
  '$project': {
    'playerId': '$players.player',
    'score': '$players.score',
    'rank': '$players.rank',
    'cashedOutTime': '$players.cashedOutTime',
  }
}

  Game
  .aggregate([project, match, tidy])
  .exec(function(err, games){
    if (err)
      console.error(err.stack);
    res.send(games);
  })
})

module.exports = api;
