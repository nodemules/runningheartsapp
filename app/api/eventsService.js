{
  function exports() {
    var Event = require('../models/event');
    var service = {
      createEvent,
      createEvents,
      checkIfEventExists,
      getEvents,
      getPastEvents
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

    var publicEventForList = [{
      path: 'venue',
      select: 'name day time numberOfGames'
    }, {
      path: 'td',
      select: '-statusId'
    }, {
      path: 'games'
    }];

    function getEvents(cb) {
      Event
        .find({
          statusId: 1
        })
        .populate(publicEventForList)
        .select('-statusId')
        .exec(function(err, events) {
          if (err) {
            return cb(err);
          }
          cb(null, events);
        });
    }

    function getPastEvents(cb) {
      Event
        .find({
          date: {
            $lt: new Date()
          },
          completed: false
        })
        .select('-statusId')
        .exec(function(err, events) {
          if (err) {
            return cb(err);
          }
          cb(null, events);
        });
    }

    function checkIfEventExists(venue, date, manual) {

      //fix this date garbage
      //need to normalize all dates in the app to avoid this kind of nonsense
      var startOfDay = new Date(date);
      startOfDay = startOfDay.setHours(0, 0, 0, 0);
      var endOfDay = new Date(date);
      endOfDay = endOfDay.setHours(23, 59, 59, 999)
      return new Promise(function(resolve, reject) {
        var event = {
          venue: venue,
          date: {
            $gte: new Date(startOfDay),
            $lte: new Date(endOfDay)
          }
        }
        if (manual) {
          event.statusId = 1;
        }
        Event
          .find(event)
          .exec((err, events) => {
            resolve({
              venue: venue,
              date: date,
              event: events[0]
            })
          })
      })
    }

    return service;
  }

  module.exports = exports;
}
