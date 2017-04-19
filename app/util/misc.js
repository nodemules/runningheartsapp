//Prereqs and Utils
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
var Venues = require('../models/venue');

//----------------------------------------------------------------------------\\

//TODO: finish venue switch statement
//TODO: Maybe create seasons
//TODO: Make historical TD player for events?
//TODO: Make this file exit.

console.log('Starting Misc Chores...')

getVenues().then((venues) => {
  correctNumberOfGames(venues);
  setTimeout(function() {
    console.log('Finished misc chores...')
    process.exit();
  }, 10000)
})


function getVenues() {

  return new Promise(function(resolve, reject) {
    Venues.find()
      .exec((err, venues) => {
        if (err)
          reject(err);
        resolve(venues);
      })

  })
}

function correctNumberOfGames(venues) {
  _.forEach(venues, function(venue) {

    var numberOfGames = getGameNumber(venue);
    venue.numberOfGames = numberOfGames;
    Venues.update({
      _id: venue._id
    }, venue,
      (err, v) => {
        if (err)
          console.log(err.stack);

      });
  })
}

function getGameNumber(venue) {
  switch (venue.name) {
    case 'ARGO':
      return 2
      break;
    case 'THT':
      return 2
      break;
    case 'ANGLES':
      return 1
      break;
    case 'TDB':
      return 1;
      break;
    default:
      return 1
  }
}
