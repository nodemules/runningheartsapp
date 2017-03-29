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

    function generateNewEvents(venues) {
      for (var h in venues) {
        var dates = dateUtil.getNextDays(dateUtil.getDayByName(venues[h].day), 3)
        for (var i in dates) {
          eventsService.checkIfEventExists(venues[h], dates[i]).then(function(resultEvent) {
            if (!resultEvent.event) {
              var event = {
                td: resultEvent.venue.td,
                venue: resultEvent.venue._id,
                date: resultEvent.date
              }
              eventsService.createEvent(event, (error, e) => {
                if (error) {
                  console.log(error)
                }
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
