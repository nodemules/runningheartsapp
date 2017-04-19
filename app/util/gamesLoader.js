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
var Events = require('../models/event');


//----------------------------------------------------------------------------\\

var file = process.argv.slice(2)[0];

console.log('\n\nLoading Games...\n\n')

var stream = fs.createReadStream(file);

var row = 1;

csv
  .fromStream(stream, {
    headers: true
  })
  .on('data', function(data) {

    if (row === 1) {
      getEventIds().then((events) => {
        var games = formatGames(data, events);
        createGames(games);
      })
    }

    row++;
  })

  .on('end', function() {
    setTimeout(function() {
      console.log('Finished adding games...')
      process.exit();
    }, 10000)
  });

function formatPlayer(data) {

  return new Promise(function(resolve, reject) {
    Players.find({
      name: data.PlayerName
    })
      .exec((err, player) => {
        if (err)
          reject(err);
        resolve({
          name: player[0].name,
          _id: player[0]._id
        });
      })
  })

}

function formatGames(data, events) {
  var games = [];

  _.forEach(data, function(value, key) {
    var game = {}
    if (key !== 'PlayerName') {
      var gameData = key.split(' ');

      var eventId = _.filter(events, function(o) {
        //add venue to this for edge case two events on same day at different venues
        return o.date >= moment(gameData[1]).startOf('day') && o.date <= moment(gameData[1]).endOf('day')
      })[0]._id;

      //revisit how to determine game number. This is stupid.
      var gameHour = moment(gameData[1]).format('HH');
      game.number = gameHour == 15 ? 1 : 2;
      game.event = mongoose.Types.ObjectId(eventId);
      game.completed = true;
      game.inProgress = false;
      game.statusId = 1;
      game.startTime = gameData[1];
      game.finalTable = true;
      game.players = [];
      games.push(game)

    }

  });

  return games;

}


function createGames(games) {
  _.forEach(games, function(game) {
    //change to create
    Games.update({
      startTime: game.startTime
    }, game, {
      upsert: true
    }, (err, g) => {
      if (err)
        console.log(err.stack);
    });

  });
}

function getEventIds() {

  return new Promise(function(resolve, reject) {
    Events.find()
      .exec((err, events) => {
        if (err)
          reject(err);
        resolve(events);
      })
  })
}
