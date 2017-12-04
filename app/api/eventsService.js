{
  function exports() {

    const LOG = require('../../config/logging').getLogger();

    var moment = require('moment-timezone');
    var Event = require('../models/event');
    var seasonsService = require('./seasonsService')();

    var service = {
      createEvent,
      createEvents,
      updateEvent,
      checkIfEventExists,
      getEvents,
      getEvent,
      getPastEvents,
      getByDate,
      getEventsBySeason,
      getCount,
      deleteEvent,
      persistEvent
    };

    var publicEvent = [{
      path: 'venue',
      select: 'name day time numberOfGames'
    }, {
      path: 'td',
      select: '-statusId'
    }, {
      path: 'games',
      match: {
        'statusId': 1
      },
      populate: {
        path: 'players',
        populate: {
          path: 'player',
          model: 'Player'
        }
      }
    }];

    var publicEventForList = [{
      path: 'venue',
      select: 'name day time numberOfGames'
    }, {
      path: 'td',
      select: '-statusId'
    }, {
      path: 'games'
    }];

    function createEvent(ev) {
      return new Promise((resolve, reject) => {
        ev.date = moment(ev.date).set({
          hour: 19,
          minute: 30,
          second: 0,
          millisecond: 0
        }).format();

        Event.create(ev, (err, e) => {
          if (err) {
            LOG.error(err);
            return reject(err);
          }
          return resolve(e);
        });
      });
    }

    function createEvents(events) {
      return new Promise((resolve, reject) => {
        Event.insertMany(events, (err, createdEvents) => {
          if (err) {
            LOG.error(err);
            return reject(err);
          }
          return resolve(createdEvents);
        });
      });
    }

    function updateEvent(ev) {
      return new Promise((resolve, reject) => {
        Event
          .findOneAndUpdate({
            _id: ev._id
          }, ev, {
            'new': true
          })
          .select('-statusId')
          .exec((err, ev) => {
            if (err) {
              LOG.error(err);
              return reject(err);
            }
            return resolve(ev);
          });
      });
    }

    function getEvents() {
      return new Promise((resolve, reject) => {
        Event
          .find({
            statusId: 1
          })
          .populate(publicEventForList)
          .select('-statusId')
          .exec(function(err, events) {
            if (err) {
              LOG.error(err);
              return reject(err);
            }
            return resolve(events);
          });

      });
    }

    function getEvent(id) {
      return new Promise((resolve, reject) => {
        Event
          .findById(id)
          .populate(publicEvent)
          .exec((err, event) => {
            if (err) {
              LOG.error(err);
              return reject(err);
            }
            return resolve(event);
          });
      });
    }

    function getPastEvents() {
      return new Promise((resolve, reject) => {
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
              LOG.error(err);
              return reject(err);
            }
            return resolve(events);
          });
      });
    }

    function getByDate(start, end) {
      return new Promise((resolve, reject) => {
        var startDate = moment(start).startOf('day').format();
        var endDate;
        if (!end) {
          endDate = moment(start).endOf('day').format();
        } else {
          endDate = moment(end).endOf('day').format();
        }
        Event
          .find({
            date: {
              $gte: startDate,
              $lte: endDate
            },
            statusId: 1
          })
          .populate(publicEvent)
          .select('-statusId')
          .exec(function(err, events) {
            if (err) {
              LOG.error(err);
              return reject(err);
            }
            return resolve(events);
          });
      });
    }

    function getEventsBySeason(seasonNumber) {
      return new Promise((resolve) => {
        var endOfTime = moment().add(1000, 'y').format();
        if (seasonNumber) {
          seasonsService.getSeason(seasonNumber).then((season) => {
            getByDate(season.startDate, season.endDate ? season.endDate : endOfTime).then((events) => {
              return resolve(events);
            });
          });
        } else {
          seasonsService.getLatestSeason().then((season) => {
            getByDate(season.startDate, endOfTime).then((events) => {
              return resolve(events);
            });
          });
        }
      });
    }

    function getCount() {
      return new Promise((resolve, reject) => {
        Event
          .count({
            statusId: 1
          })
          .exec((err, count) => {
            if (err) {
              LOG.error(err);
              return reject(err);
            }
            return resolve({
              count: count
            });
          });
      });
    }

    function deleteEvent(id) {
      return new Promise((resolve, reject) => {

        Event
          .findByIdAndUpdate(id, {
            statusId: 2
          })
          .exec((err) => {
            if (err) {
              LOG.error(err);
              return reject(err);
            }
            return resolve();
          });
      });
    }

    function persistEvent(ev) {
      return new Promise((resolve, reject) => {
        if (ev._id) {
          updateEvent(ev).then((ev) => {
            return resolve(ev);
          });
        } else {
          checkIfEventExists(ev.venue, ev.date, true).then((eventInfo) => {
            if (!eventInfo.event) {
              createEvent(ev).then((e) => {
                return resolve(e);
              });
            } else {
              return reject({
                message: 'An event already exists.',
                code: 'EVENT_ALREADY_EXISTS'
              });
            }
          });
        }
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
        };
        if (manual) {
          event.statusId = 1;
        }
        Event
          .find(event)
          .exec((err, events) => {
            if (err) {
              LOG.error(err);
              return reject(err);
            }
            return resolve({
              venue: venue,
              date: date,
              event: events[0]
            });
          });
      });
    }

    return service;
  }

  module.exports = exports;
}
