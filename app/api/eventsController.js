{
  var express = require('express'),
    api = express.Router(),
    moment = require('moment-timezone');

  var authService = require('./authService')(),
    Permissions = require('../enum/permissions'),
    eventsService = require('./eventsService')(),
    Event = require('../models/event');

  var publicEvent = [{
    path: 'venue',
    select: 'name day time numberOfGames'
  }, {
    path: 'td',
    select: '-statusId'
  }, {
    path: 'games',
    populate: {
      path: 'players',
      populate: {
        path: 'player',
        model: 'Player'
      }
    }
  }];

  api.get('/', function(req, res) {
    eventsService.getEvents(function(err, events) {
      if (err) {
        return res.send(err)
      }
      res.send(events);
    });
  });

  api.get('/date', function(req, res) {
    eventsService.getByDate(req.query.startDate, req.query.endDate).then((events) => {
      res.send(events);
    })
  })

  api.get('/count', (req, res) => {
    eventsService.getCount().then((count) => {
      res.send(count)
    })
  })

  api.get('/:id', (req, res) => {
    eventsService.getEvent(req.params.id).then((event) => {
      res.send(event);
    })
  })

  api.post('/',
    (req, res, next) => {
      let permissions = [];
      permissions.push(req.body._id ? Permissions.EDIT_EVENT : Permissions.ADD_EVENT);
      authService.checkPermissions(req, res, next, permissions);
    },
    (req, res) => {
      if (req.body._id) {
        Event
          .findOneAndUpdate({
            _id: req.body._id
          }, req.body, {
            'new': true
          })
          .select('-statusId')
          .exec((err, e) => {
            if (err)
              res.send(err);
            res.send(e);
          })
      } else {
        eventsService.checkIfEventExists(req.body.venue, req.body.date, true).then((eventInfo) => {
          if (!eventInfo.event) {
            var event = req.body;
            event.date = moment(event.date).set({
              hour: 19,
              minute: 30,
              second: 0,
              millisecond: 0
            }).format();
            eventsService.createEvent(event, (error, e) => {
              if (error) {
                return res.send(error)
              }
              res.send(e)
            });
          } else {
            res.send(416, {
              message: 'An event already exists.',
              code: 'EVENT_ALREADY_EXISTS'
            })
          }
        })
      }
    });

  api.delete('/:id',
    (req, res, next) => authService.checkPermissions(req, res, next, [Permissions.DELETE_PLAYER]),
    (req, res) => {
      eventsService.deleteEvent(req.params.id).then(() => {
        res.send(200);
      })
    })

  module.exports = api;
}
