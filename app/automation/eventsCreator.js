{
  function exports() {
    var eventsService = require('../api/eventsService')(),
      dateUtil = require('../util/dateUtil')();
    var service = {
      generateNewEvents,
      generateNewEventsForVenue
    }

    function generateNewEventsForVenue(venue, cb) {
      var events = [];
      var dates = dateUtil.getNextDays(dateUtil.getDayByName(venue.day), 3)
      for (var i in dates) {
        var event = {
          td: venue.td,
          venue: venue._id,
          date: dates[i]
        }
        events.push(event)
      }
      eventsService.createEvents(events, function(error, events) {
        cb(error, events);
      });
    }

    function generateNewEvents(venues, cb) {
      var events = [];
      for (var h in venues) {
        var dates = dateUtil.getNextDays(dateUtil.getDayByName(venues[h].day), 3)
        for (var i in dates) {
          var event = {
            td: venues[h].td,
            venue: venues[h]._id,
            date: dates[i]
          }
          events.push(event)
        }
      }
      eventsService.createEvents(events, function(error, events) {
        cb(error, events);
      });
    }

    return service;
  }

  module.exports = exports;
}
