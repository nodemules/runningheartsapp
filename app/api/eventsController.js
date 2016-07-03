var express = require('express'),
    api     = express.Router();

var Venues  = require('../models/venue'),
    Users   = require('../models/user'),
    Players = require('../models/player'),
    Event   = require('../models/event'),
    Game    = require('../models/game');

  var publicEvent = [
    { 
      path : 'venue', 
      select : 'name day' 
    }, 
    { 
      path : 'td', 
      select : 'name user', 
      populate : { 
        path : 'user', 
        model : 'User', 
        select : 'local.username' 
      } 
    },
    {
      path : 'games'
    }
  ];

api.get('/', function(req, res) {
  Event
    .find({ statusId : 1 })
    .populate(publicEvent)
    .select('-statusId')
    .exec(function(err, events) {
      if (err)
        res.send(err);
      res.send(events);
    })
});

api.get('/:id', function(req, res) {
  Event
    .findById(req.params.id)
    .populate(publicEvent)
    .select('-statusId')
    .exec(function(err, events) {
      if (err)
        res.send(err);
      res.send(events);
    })
});

api.post('/', function(req, res) {
  Event.create(req.body, function(err, e) {
    if (err)
      console.log(err.stack);
    res.send(e);
  })
});

api.put('/', function(req, res) {
  Event.findOneAndUpdate({ _id : req.body._id }, req.body, 
    function (err, event) {
      if (err)
        res.send(err);
      res.send(event);
  })
});

api.delete('/:id', function(req, res) {
  req.body.statusId = 2;
  Event
    .findByIdAndUpdate(req.params.id, req.body)
    .exec(function (err) {
      if (err)
        console.log(err.stack);
      res.send();
    })
})

module.exports = api;