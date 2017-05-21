{
  function exports() {
    var moment = require('moment-timezone')
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
            $lt: moment().startOf('day').format()
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
      return new Promise(function(resolve, reject) {
        var event = {
          venue: venue,
          date: {
            $gte: moment(date).startOf('day').format(),
            $lte: moment(date).endOf('day').format()
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
