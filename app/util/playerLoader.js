//Prereqs and Utils
var csv = require('fast-csv');
var fs = require('fs');
var _ = require('lodash');

//Database
var mongoose = require('mongoose');
var configuration = require('../../config/configuration.js');
var env = process.env.npm_config_dev ? 'dev' : 'prod';
var db = configuration[env === 'dev' ? 'localdb' : 'remotedb'];
mongoose.connect(`mongodb://${db.user}:${db.key}@${db.host}:${db.port}/${db.name}`); // connect to our configuration

//Models
var Players = require('../models/player');

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

    var player = formatPlayer(data);

    createPlayer(player);

    row++;
  })

  .on('end', function() {
    //console.log('Venues, Games, Players Loaded!');
    //need to only exit when all functions complete, this is firing before everything is done
    //process.exit()
  });


function formatPlayer(data) {

  var player = {};
  _.forEach(data, function(value, key) {

    if (key === 'PlayerName') {
      player.name = value;
      player.shoutOuts = 0;
      player.statusId = 1;
    }

  });

  return player;

}

function createPlayer(player) {
  Players.update({
    name: player.name
  }, player, {
    upsert: true
  }, (err, p) => {
    if (err)
      console.log(err.stack);
  });
}
