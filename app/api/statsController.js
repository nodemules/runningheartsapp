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

var lookupPlayer = {
  '$lookup': {
    from: 'players', //<collection to join>,
    localField: '_id', //<field from the input documents>,
    foreignField: '_id', //<field from the documents of the "from" collection>,
    as: 'player' //<output array field>
  }
}

var lookupEvent = {
  '$lookup': {
    from: 'events',
    localField: 'event',
    foreignField: '_id',
    as: 'event'
  }
}

var lookupVenue = {
  '$lookup': {
    from: 'venues',
    localField: 'event.venue',
    foreignField: '_id',
    as: 'event.venue'
  }
}

var unwindPlayer = {
  '$unwind': {
    'path': '$player'
  }
}

var unwindEvent = {
  '$unwind': {
    'path': '$event'
  }
}

var unwindVenue = {
  '$unwind': {
    'path': '$event.venue'
  }
}

api.get('/players/:id', function(req, res){

  var match = {
    '$match': {
      'players.player' : mongoose.Types.ObjectId(req.params.id)
    }
  }

  var pipeline = [unwind, match, sort, lookupEvent, unwindEvent, lookupVenue, unwindVenue, group, lookupPlayer, unwindPlayer];

  Game
  .aggregate(pipeline)
  .exec(function(err, games){
    if (err)
      console.error(err.stack);
    res.send(games);
  })
})

api.get('/players', function(req, res){

  var pipeline = [unwind, sort, lookupEvent, unwindEvent, lookupVenue, unwindVenue, group, lookupPlayer, unwindPlayer];

  Game
  .aggregate(pipeline)
  .exec(function(err, games){
    if (err)
      console.error(err.stack);
    res.send(games);
  })
})


module.exports = api;
