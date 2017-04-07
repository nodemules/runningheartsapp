//Prereqs and Utils
var csv = require('fast-csv');
var fs = require('fs');
var _ = require('lodash');
var moment = require('moment');
var express = require('express');
var api = express.Router();

//Database
var mongoose = require('mongoose');
var configuration = require('../../config/configuration.js');
var env = process.env.npm_config_dev ? 'dev' : 'prod';
var db = configuration[env === 'dev' ? 'localdb' : 'remotedb'];
mongoose.connect(`mongodb://${db.user}:${db.key}@${db.host}:${db.port}/${db.name}`); // connect to our configuration

//Models
var Players = require('../models/player');
var Venues = require('../models/venue');
var Events = require('../models/event');
var Games = require('../models/game');

//----------------------------------------------------------------------------\\

var file = process.argv.slice(2)[0];

console.log(`\n\nLoading ${file}...\n\n`)

var stream = fs.createReadStream(file);

var row = 1;

csv
  .fromStream(stream, {
    headers: true
  })
  .on('data', function(data) {
    /* PLAYERS */
    //reduce amount of times this has to process
    if (row === 1) {
      var players = formatPlayers(data);
      upsertPlayers(players);
      console.log('Finished Creating Players')
    }

    /* VENUES */
    var venue = formatVenue(data.venue, data.date);
    upsertVenue(venue);

    /* EVENTS */
    var event = formatEvent(data.venue, data.date);

    getVenueByName(data.venue).then((venue) => {
      event.venue = mongoose.Types.ObjectId(venue[0]._id);
      upsertEvent(event);
    })

    var gamePlayers = formatPlayersForGame(data);
    var game = formatGame(data, gamePlayers);
    upsertGame(game);

    row++;
  })

  .on('end', function() {
    console.log('\n\n\nVenues, Games, Players Loaded!');
    //need to only exit when all functions complete, this is firing before everything is done
    //process.exit()
  });

function formatGame(data, players) {
  var game = {};
  game.completed = true;
  game.inProgress = false;
  game.statusId = 1;
  game.startTime = data.date;
  game.finalTable = true;
  game.number = data.number;
  game.players = players;

  return game;

}

function upsertGame(game) {
  Games.findOneAndUpdate({
    startTime: game.startTime
  }, game, {
    upsert: true,
    returnNewDocument: true
  }, (err, g) => {
    if (err)
      console.log(err.stack);
  });

}

function formatPlayers(data) {

  var players = [];

  _.forEach(data, function(value, key) {
    var player = {};

    if (key === 'venue' || key === 'date' || key === 'number') {
      return;
    }

    player.name = key;
    player.shoutOuts = 0;
    player.statusId = 1;
    players.push(player);

  });

  return players;

}

function upsertPlayers(players) {
  _.forEach(players, function(player) {
    Players.update({
      name: player.name
    }, player, {
      upsert: true
    }, (err, p) => {
      if (err)
        console.log(err.stack);
    });

  });
}

//Do we need cashedOutTime? -jr
function formatPlayersForGame(data) {

  var players = [];

  _.forEach(data, function(value, key) {
    var player = {};

    if (key === 'venue' || key === 'date' || key === 'number') {
      return;
    }

    player.rank = getRank(value);
    player.score = value;
    players.push(player);

  });

  return players;

}

function formatEvent(venueName, date) {
  var event = {};

  //events shouldn't have a time, games should have times
  event.date = moment(date).startOf('day');
  event.games = [];
  event.statusId = 1;
  event.td = [];

  return event;

}

function upsertEvent(event) {
  Events.findOneAndUpdate({
    date: event.date,
    venue: event.venue
  }, event, {
    upsert: true,
    returnNewDocument: true
  }, (err, p) => {
    if (err)
      console.log(err.stack);

  });
}

//TODO: number of games by finding highest number per venue from input file somehow
function formatVenue(venueName, date) {
  var venue = {};

  venue.name = venueName;
  venue.day = moment(date).format('dddd');
  venue.numberOfGames = 2;
  venue.events = [];
  venue.statusId = 1;
  venue.td = [];

  return venue;

}

function upsertVenue(venue) {
  Venues.update({
    name: venue.name
  }, venue, {
    upsert: true
  }, (err, p) => {
    if (err)
      console.log(err.stack);
  });
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

function getVenueByName(venue) {

  return new Promise(function(resolve, reject) {
    Venues.find({
      name: venue
    })
      .exec((err, venue) => {
        if (err)
          console.log(err);
        resolve(venue);
      })

  })
}
