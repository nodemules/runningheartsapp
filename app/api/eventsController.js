{
  var express = require('express'),
    api = express.Router();

  var authService = require('./authService')(),
    Permissions = require('../enum/permissions'),
    Event = require('../models/event');

  var publicEvent = [{
    path: 'venue',
    select: 'name day numberOfGames'
  }, {
    path: 'td',
    select: '-statusId'
  }, {
    path: 'games'
  }];

  api.get('/', (req, res) => {
    Event
      .find({
        statusId: 1
      })
      .populate(publicEvent)
      .select('-statusId')
      .exec((err, events) => {
        if (err)
          res.send(err);
        res.send(events);
      })
  })

  api.get('/count', (req, res) => {
    Event
      .count({
        statusId: 1
      })
      .exec((err, count) => {
        if (err)
          res.send(err);
        res.send({
          count: count
        });
      })
  })

  api.get('/:id', (req, res) => {
    Event
      .findById(req.params.id)
      .populate(publicEvent)
      .exec((err, events) => {
        if (err)
          res.send(err);
        res.send(events);
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
        Event.create(req.body, (err, e) => {
          if (err)
            console.log(err.stack);
          res.send(e);
        })
      }
    });

  api.delete('/:id',
    (req, res, next) => authService.checkPermissions(req, res, next, [Permissions.DELETE_PLAYER]),
    (req, res) => {
      req.body.statusId = 2;
      Event
        .findByIdAndUpdate(req.params.id, req.body)
        .exec((err) => {
          if (err)
            console.log(err.stack);
          res.send();
        })
    })

  module.exports = api;
}
