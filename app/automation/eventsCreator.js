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
      var dates = dateUtil.getNextDays(venue.day, 3)
      for (var i in dates) {
        var ev = {
          td: venue.td,
          venue: venue._id,
          date: dates[i]
        }
        events.push(ev)
      }
      eventsService.createEvents(events).then((events) => {
        cb(events)
      });
    }

    function generateNewEvents(venues) {
      for (var h in venues) {
        var dates = dateUtil.getNextDays(venues[h].day, 3)
        for (var i in dates) {
          eventsService.checkIfEventExists(venues[h], dates[i]).then(function(resultEvent) {
            if (!resultEvent.event) {
              var ev = {
                td: resultEvent.venue.td,
                venue: resultEvent.venue._id,
                date: resultEvent.date
              }
              eventsService.createEvent(ev).then((e) => {
                console.log('CREATING EVENT: ', e)
              })
            }
          }).catch(function(err) {
            console.log(err)
          })
        }
      }
    }

    return service;
  }

  module.exports = exports;
}
