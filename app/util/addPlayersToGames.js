//Prereqs and Utils
var csv = require('fast-csv');
var fs = require('fs');
var _ = require('lodash');
var moment = require('moment');


//Database
var mongoose = require('mongoose');
var configuration = require('../../config/configuration.js');
var env = process.env.npm_config_dev ? 'dev' : 'prod';
var db = configuration[env === 'dev' ? 'localdb' : 'remotedb'];
mongoose.connect(`mongodb://${db.user}:${db.key}@${db.host}:${db.port}/${db.name}`); // connect to our configuration

//Models
var Games = require('../models/game');
var Players = require('../models/player');


//----------------------------------------------------------------------------\\

var file = process.argv.slice(2)[0];

console.log('\n\nStarting Add Players to Games Process...\n\n')

var stream = fs.createReadStream(file);

var row = 1;

csv
  .fromStream(stream, {
    headers: true
  })
  .on('data', function(data) {

    getPlayerIds(data).then((players) => {

      var playerId = _.find(players, {
        name: data.PlayerName
      })._id;

      var player = {
        name: data.PlayerName,
        _id: playerId
      };

      var playerGameData = formatDataForGame(player, data);

      addPlayersToGame(playerGameData);

    })

    row++;
  })

  .on('end', function() {
    setTimeout(function() {
      console.log('Finished adding players to games...')
      process.exit();
    }, 10000)
  });

function getPlayerIds(data) {

  return new Promise(function(resolve, reject) {
    Players.find()
      .exec((err, players) => {
        if (err)
          reject(err);
        resolve(players);
      })
  })
}

function formatDataForGame(player, data) {
  var playerData = [];

  _.forEach(data, function(value, key) {
    var game = {};
    var gameData = key.split(' ');

    if (key !== 'PlayerName' && value) {
      game.player = mongoose.Types.ObjectId(player._id),
        game.score = value,
        game.rank = getRank(value),
        game.date = gameData[1]
      game.cashedOutTime = moment(gameData[1]).endOf('day')
      playerData.push(game)
    }
  })
  return playerData;
}

function addPlayersToGame(playerData) {
  _.forEach(playerData, function(player) {
    Games.update({
      startTime: player.date
    }, {
      $push: {
        players: player
      }
    },
      (err, g) => {
        if (err)
          console.log(err.stack);
      });
  })
}

function getRank(score) {
  if (score == 10) {
    return 1;
  } else if (score > 1 && score < 9) {
    return 10 - score;
  } else {
    return 9;
  }
}
