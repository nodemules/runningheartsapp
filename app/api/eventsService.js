{
  function exports() {
    var Event = require('../models/event');
    var service = {
      createEvent,
      createEvents,
      checkIfEventExists
    }

    function createEvent(event, cb) {
      Event.create(event, (err, e) => {
        if (err)
          return cb(err);
        return cb(null, e);
      })
    }

    function createEvents(events, cb) {
      Event.insertMany(events, (err, e) => {
        if (err)
          return cb(err);
        return cb(null, e);
      })
    }

    function checkIfEventExists(venue, date) {

      //fix this date garbage
      //need to normalize all dates in the app to avoid this kind of nonsense
      var startOfDay = new Date(date);
      startOfDay = startOfDay.setHours(0, 0, 0, 0);
      var endOfDay = new Date(date);
      endOfDay = endOfDay.setHours(23, 59, 59, 999)
      return new Promise(function(resolve, reject) {
        Event
          .find({
            statusId: 1,
            venue: venue,
            date: {
              $gte: new Date(startOfDay),
              $lte: new Date(endOfDay)
            }
          })
          .exec((err, event) => {
            resolve({
              venue: venue,
              date: date,
              event: event
            })
          })
      })
    }

    return service;
  }

  module.exports = exports;
}
