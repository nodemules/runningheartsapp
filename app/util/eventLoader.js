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
var Events = require('../models/event');
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
      getVenueIds().then((venues) => {
        var events = formatEvents(data, venues);
        createEvents(events);
      })
    }


    row++;
  })

  .on('end', function() {
    //need to only exit when all functions complete, this is firing before everything is done
    //process.exit()
  });


function formatEvents(data, venues) {
  var events = [];

  _.forEach(data, function(value, key) {
    var event = {}
    if (key !== 'PlayerName') {

      var eventData = key.split(' ');

      var venueId = _.filter(venues, {
        name: eventData[0]
      })[0]._id;

      event.date = moment(eventData[1]).startOf('day');
      event.games = [];
      event.statusId = 1;
      event.td = [];
      event.venue = mongoose.Types.ObjectId(venueId);
      event.completed = true;
      events.push(event);

    }

  });
  return events;

}

function createEvents(events) {
  _.forEach(events, function(event) {
    Events.update({
      date: event.date,
      venue: event.venue
    }, event, {
      upsert: true
    },
      (err, e) => {
        if (err)
          console.log(err.stack);
      });

  });
}

function getVenueIds() {

  return new Promise(function(resolve, reject) {
    Venues.find()
      .exec((err, venues) => {
        if (err)
          reject(err);
        resolve(venues);
      })

  })
}
