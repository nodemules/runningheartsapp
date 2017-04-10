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
var Venues = require('../models/venue');

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

    if (row === 1) {
      var venues = formatVenues(data);
      createVenues(venues);
    }

    row++;

  })

  .on('end', function() {
    //need to only exit when all functions complete, this is firing before everything is done
    //process.exit()
  });


function formatVenues(data) {
  var venues = [];

  _.forEach(data, function(value, key) {
    var venue = {}
    if (key !== 'PlayerName') {
      var venueData = key.split(' ');

      venue.name = venueData[0];
      venue.day = moment(venueData[1]).format('dddd');
      //TODO: make dynamic
      venue.numberOfGames = 2;
      venue.events = [];
      venue.statusId = 1;
      venue.td = [];
      venues.push(venue);
    }

  });

  venues = _.uniqBy(venues, 'name')
  return venues;

}

function createVenues(venues) {
  _.forEach(venues, function(venue) {
    Venues.update({
      name: venue.name
    }, venue, {
      upsert: true
    }, (err, p) => {
      if (err)
        console.log(err.stack);
    });

  });
}
