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

console.log('\n\nStarting Add Games To Events Process...\n\n')

var stream = fs.createReadStream(file);

var row = 1;

csv
  .fromStream(stream, {
    headers: true
  })
  .on('data', function(data) {

    if (row === 1) {
      getGameIds().then((games) => {
        addGamesToEvent(games);
      })

    }

    row++;
  })

  .on('end', function() {
    setTimeout(function() {
      console.log('Finished adding games to events...')
      process.exit();
    }, 10000)
  });

function getGameIds() {

  return new Promise(function(resolve, reject) {
    Games.find()
      .exec((err, games) => {
        if (err)
          reject(err);
        resolve(games);
      })
  })
}

function addGamesToEvent(games) {
  _.forEach(games, function(game) {

    Events.update({
      _id: game.event
    }, {
      $push: {
        games: mongoose.Types.ObjectId(game._id)
      }
    },
      (err, g) => {
        if (err)
          console.log(err.stack);
      });
  })
}
