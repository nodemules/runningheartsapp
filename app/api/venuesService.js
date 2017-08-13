{
  function exports() {

    var _ = require('lodash');

    var ArrayUtil = require('../util/arrayUtil')();

    var Venue = require('../models/venue');
    var Event = require('../models/event');
    var Game = require('../models/game');

    const VenuesMatcher = require('../matchers/venuesMatchers')();
    const GlobalMatcher = VenuesMatcher.GLOBAL;

    var service = {
      getVenues,
      getAllVenues
    }

    function getVenues() {
      return new Promise((resolve, reject) => {
        getAllVenues().then((venues) => {
          getVenuesWithEvents().then((venuesWithEvents) => {
            getVenuesWithGames().then((venuesWithGames) => {
              return resolve(ArrayUtil.mergeById(ArrayUtil.unionById(venuesWithGames, venues),
                venuesWithEvents));
            });
          });
        });
      });
    }

    function getVenuesWithEvents() {
      return new Promise((resolve, reject) => {

        var pipeline = [
          VenuesMatcher.GET_VENUES_WITH_EVENTS.lookupVenues,
          GlobalMatcher.unwindVenues,
          GlobalMatcher.matchVenue,
          GlobalMatcher.unwindTds,
          GlobalMatcher.lookupTds,
          VenuesMatcher.GET_VENUES_WITH_EVENTS.group,
          GlobalMatcher.unwindVenues,
          VenuesMatcher.GET_VENUES_WITH_EVENTS.project
        ];

        Event
          .aggregate(pipeline)
          .exec(function(err, venues) {
            if (err) {
              console.error(err.stack);
              return reject(err);
            }
            return resolve(venues);
          });

      })
    }

    function getVenuesWithGames() {
      return new Promise((resolve, reject) => {

        var pipeline = [
          VenuesMatcher.GET_VENUES_WITH_GAMES.lookupEvents,
          VenuesMatcher.GET_VENUES_WITH_GAMES.unwindEvents,
          VenuesMatcher.GET_VENUES_WITH_GAMES.matchEvent,
          VenuesMatcher.GET_VENUES_WITH_GAMES.lookupVenues,
          GlobalMatcher.unwindVenues,
          GlobalMatcher.matchVenue,
          VenuesMatcher.GET_VENUES_WITH_GAMES.group,
          GlobalMatcher.unwindVenues,
          GlobalMatcher.unwindTds,
          GlobalMatcher.lookupTds,
          GlobalMatcher.unwindTds,
          VenuesMatcher.GET_VENUES_WITH_GAMES.finalGroup,
          GlobalMatcher.unwindVenues,
          VenuesMatcher.GET_VENUES_WITH_GAMES.project
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
