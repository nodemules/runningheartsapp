var express = require('express'),
    api     = express.Router(),
    _       = require('lodash');
    mongoose = require('mongoose');

var Venues  = require('../models/venue'),
    Users   = require('../models/user'),
    Players = require('../models/player'),
    Event   = require('../models/event'),
    Game    = require('../models/game');

var stats = {};

api.get('/players', function(req, res) {
  stats.players = []
  var pOptions = [
    {
      path : 'event',
      populate: [
        {
          path : 'venue',
          select : 'name day'
        },
        {
          path : 'td',
          select : 'name user',
          populate : {
            path : 'user',
            model : 'User',
            select : 'local.username'
          }
        },
        {
          path : 'games',
          select : 'event number'
        }
      ]
    },
    {
      path : 'players',
      populate : {
        path : 'player',
        select : 'name isTd'
      }
    }
  ];
  Game
    .find({ completed : true })
    .select('-games')
    .populate(pOptions)
    .exec(function(err, games) {
      if (err)
        console.err(err);
      for (var i in games) {
        var players = games[i].players;
        for (var j in players) {
          parsePlayerData(players[j], games[i]);
        }
      }
      res.send(stats.players);
    })

});

function parsePlayerData(record, game) {
  var p = {
    name : record.player.name,
    _id : record.player._id,
    games : [],
    stats : {
      totalGames : 1,
      totalWins : 0,
      totalPoints : 0
    }
  }
  var r = {
    gameId : game._id,
    venueName : game.event.venue.name,
    rank : record.rank,
    score: record.score,
    cashedOutTime : record.cashedOutTime
  }

  var p1 = _.filter(stats.players, { '_id' : p._id });
  if (p1 && p1.length) {
    var x = p1[0];
    updateStats(x.stats, r);
    x.games.push(r);
  } else {
    updateStats(p.stats, r);
    p.games.push(r);
    stats.players.push(p);
  }

  function updateStats(stats, record) {
    stats.totalWins += (record.rank === 1) ? 1 : 0;
    stats.totalPoints += record.score;
    stats.bonusChips = Math.floor(stats.totalPoints / 10) * 100;
    stats.totalGames++;
  }

}

api.get('/players/:id', function(req, res){

  var unwind = {
    '$unwind': {
      'path': '$players'
    }
  }

  var match = {
    '$match': {
      'players.player' : mongoose.Types.ObjectId(req.params.id)
    }
  }

  var group = {
    '$group': {
      '_id': '$players.player',
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

  Game
  .aggregate([unwind, match, group])
  .exec(function(err, games){
    if (err)
      console.error(err.stack);
    res.send(games);
  })
})

module.exports = api;
