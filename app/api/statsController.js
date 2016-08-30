var express = require('express'),
    api     = express.Router(),
    _       = require('lodash');

var Venues  = require('../models/venue'),
    Users   = require('../models/user'),
    Players = require('../models/player'),
    Event   = require('../models/event'),
    Game    = require('../models/game');

var stats = {
  players : []
};

api.get('/', function(req, res) {
  stats = {
    players : []
  }
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
      res.send(stats);
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
    x.stats.totalWins += (r.rank === 1) ? 1 : 0;
    x.stats.totalPoints += r.score;
    x.stats.totalGames++;
    x.games.push(r);
  } else {
    p.games.push(r);
    p.stats.totalWins += (r.rank === 1) ? 1 : 0;
    p.stats.totalPoints += r.score;
    stats.players.push(p);
  }

  function addGame(games, game) {
    
  }

}

module.exports = api;
