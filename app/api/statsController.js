var express = require('express'),
    api     = express.Router(),
    _       = require('lodash');
    mongoose = require('mongoose');

var Venues  = require('../models/venue'),
    Users   = require('../models/user'),
    Players = require('../models/player'),
    Event   = require('../models/event'),
    Game    = require('../models/game');

var unwind = {
  '$unwind': {
    'path': '$players'
  }
}

var group = {
  '$group': {
    '_id': '$players.player',
    'totalPoints': { '$sum': '$players.score'},
    'averageRank': { '$avg': '$players.rank'},
    'bestRank': {'$min': '$players.rank'},
    'worstRank': {'$max': '$players.rank'},
    'games': {
      $push: {
        '_id': '$_id',
        'score': '$players.score',
        'rank': '$players.rank',
        'event': '$event',
        'gameNumber': '$number',
        'gameStartTime': '$startTime',
        'completed': '$completed',
        'inProgress': '$inProgress',
        'finalTable': '$finalTable',
        'cashedOutTime': '$players.cashedOutTime'
      }
    }
  }
}

var sort = {
  '$sort': { 'startTime': -1 }
}

api.get('/players/:id', function(req, res){

  var match = {
    '$match': {
      'players.player' : mongoose.Types.ObjectId(req.params.id)
    }
  }

  var pipeline = [unwind, match, sort, group];

  Game
  .aggregate(pipeline)
  .exec(function(err, games){
    if (err)
      console.error(err.stack);
    res.send(games);
  })
})

api.get('/players', function(req, res){

  var pipeline = [unwind, sort, group];

  Game
  .aggregate(pipeline)
  .exec(function(err, games){
    if (err)
      console.error(err.stack);
    res.send(games);
  })
})


module.exports = api;
