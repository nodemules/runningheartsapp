var express = require('express'),
    api     = express.Router(),
    _       = require('lodash');
    mongoose = require('mongoose');

var Venues  = require('../models/venue'),
    Users   = require('../models/user'),
    Players = require('../models/player'),
    Event   = require('../models/event'),
    Game    = require('../models/game'),
    Season  = require('../models/season');

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
    'totalWins': { $sum: { $cond: [ { $eq: [ '$players.rank', 1 ] }, 1, 0 ] } },
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

var project = {
  '$project': {
    '_id': '$_id',
    'name': '$player.name',
    'isTd': '$player.isTd',
    'totalPoints': '$totalPoints',
    'totalWins': '$totalWins',
    'bonusChips': { $multiply: [ { $floor: { $divide: ['$totalPoints', 10] } }, 100] },
    'averageRank': '$averageRank',
    'bestRank': '$bestRank',
    'worstRank': '$worstRank',
    'games': '$games'
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

  var pipeline = [unwind, match, sort, lookupEvent, unwindEvent, lookupVenue, unwindVenue, group, lookupPlayer, unwindPlayer, project];

  Game
  .aggregate(pipeline)
  .exec(function(err, players){
    if (err)
      console.error(err.stack);
    res.send(players[0]);
  })
})

api.get('/players', function(req, res){

  var sortBy = {
    '$sort': { 'totalPoints': -1, 'averageRank': 1 }
  }
  var pipeline = [unwind, sort, lookupEvent, unwindEvent, lookupVenue, unwindVenue, group, lookupPlayer, unwindPlayer, project, sortBy];

  Game
  .aggregate(pipeline)
  .exec(function(err, players){
    if (err)
      console.error(err.stack);
    res.send(players);
  })
})

api.get('/seasonalPlayers/:seasonNumber', function(req, res){

  Season
  .find( {seasonNumber : req.params.seasonNumber} )
  .exec(function(err, season){
    if (err)
      console.log(err)

    var sortBy = {
      '$sort': { 'totalPoints': -1, 'averageRank': 1 }
    }

    var startTime = season[0].startDate;
    var endTime = season[0].endDate;

    var match = {
      '$match': { 'startTime' : { '$gte' : new Date(startTime) } }
    }

    if (endTime) {
      match.$match.startTime.$lt = new Date(endTime);
    }

    var pipeline = [match, unwind, sort, lookupEvent, unwindEvent, lookupVenue, unwindVenue, group, lookupPlayer, unwindPlayer, project, sortBy];

    Game
    .aggregate(pipeline)
    .exec(function(err, players){
      if (err)
        console.error(err.stack);
      res.send(players);
    })
  })


})

module.exports = api;
