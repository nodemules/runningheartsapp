{
  function exports() {

    var _ = require('lodash');

    var Venue = require('../models/venue');
    var Game = require('../models/game');

    const VenuesMatcher = require('../matchers/venuesMatchers')();
    const GlobalMatcher = VenuesMatcher.GLOBAL;

    var service = {
      getVenues,
      getVenuesWithEvents
    }

    function getVenues() {
      return new Promise((resolve, reject) => {
        getAllVenues().then((venues) => {
          getVenuesWithEvents().then((venuesWithEvents) => {
            return resolve(_.unionBy(venuesWithEvents, venues, (a) => {
              return _.find(venues, {
                _id: a._id
              });
            }));
          })
        })
      })
    }

    function getVenuesWithEvents() {
      return new Promise((resolve, reject) => {

        var pipeline = [
          GlobalMatcher.lookupEvents,
          GlobalMatcher.unwindEvents,
          GlobalMatcher.matchEvent,
          GlobalMatcher.lookupVenues,
          GlobalMatcher.unwindVenues,
          GlobalMatcher.matchVenue,
          GlobalMatcher.group,
          GlobalMatcher.unwindVenues,
          GlobalMatcher.unwindTds,
          GlobalMatcher.lookupTds,
          GlobalMatcher.unwindTds,
          GlobalMatcher.finalGroup,
          GlobalMatcher.unwindVenues,
          GlobalMatcher.project
        ];

        Game
          .aggregate(pipeline)
          .exec(function(err, venues) {
            if (err) {
              console.error(err.stack);
              return reject(err);
            }
            return resolve(venues);
          });

      });
    }

    function getAllVenues() {
      return new Promise((resolve, reject) => {
        Venue
          .find({
            statusId: 1
          })
          .populate('td')
          .select('-statusId')
          .exec(function(err, venues) {
            if (err) {
              console.error(err.stack);
              return reject(err);
            }
            return resolve(venues);
          });
      })
    }

    return service;
  }

  module.exports = exports;
}
