{
  var express = require('express'),
    api = express.Router();

  var authService = require('./authService')(),
    Permissions = require('../enum/permissions'),
    eventsService = require('./eventsService')();

  api.get('/', function(req, res) {
    eventsService.getEvents().then((events) => {
      return res.send(events);
    });
  });

  api.get('/date', function(req, res) {
    eventsService.getByDate(req.query.startDate, req.query.endDate).then((events) => {
      return res.send(events);
    });
  });

  api.get('/season/:seasonNumber', function(req, res) {
    eventsService.getEventsBySeason(req.params.seasonNumber).then((events) => {
      return res.send(events);
    });

  });

  api.get('/season', (req, res) => {
    eventsService.getEventsBySeason().then((events) => {
      return res.send(events);
    });
  });

  api.get('/count', (req, res) => {
    eventsService.getCount().then((count) => {
      return res.send(count);
    });
  });

  api.get('/:id', (req, res) => {
    eventsService.getEvent(req.params.id).then((event) => {
      return res.send(event);
    });
  });

  api.post('/',
    (req, res, next) => {
      let permissions = [];
      permissions.push(req.body._id ? Permissions.EDIT_EVENT : Permissions.ADD_EVENT);
      authService.checkPermissions(req, res, next, permissions);
    },
    (req, res) => {
      eventsService.persistEvent(req.body).then((ev) => {
        return res.send(ev);
      }, (err) => {
        return res.send(416, err);
      });
    });

  api.delete('/:id',
    (req, res, next) => authService.checkPermissions(req, res, next, [Permissions.DELETE_PLAYER]),
    (req, res) => {
      eventsService.deleteEvent(req.params.id).then(() => {
        return res.send(200);
      });
    });

  module.exports = api;
}
