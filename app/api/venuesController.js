var express = require('express'),
    api     = express.Router();

var Venues  = require('../models/venue'),
    Users   = require('../models/user'),
    Players = require('../models/player'),
    Event   = require('../models/event'),
    Game    = require('../models/game');

api.get('/', function(req, res, next) {
    Venues
    .find()
    .populate('td')
    .exec(function(err, venues) {
      if (err)
        console.log(err.stack);
      res.json(venues);
    });
});

api.get('/:id', function(req, res, next) {
  Venues
    .findById(req.params.id)
    .populate('td')
    .exec(function(err, venue) {
      if (err)
        console.log(err.stack);
      res.json(venue);
  });
});

api.post('/', function(req, res) {
  Venues
    .create(req.body, function(err, venue) {
      if (err)
        console.log(err.stack);
      res.send(venue);
    });
});

api.put('/', function(req, res){
  Venues
    .findOneAndUpdate({ _id : req.body._id }, req.body, { "new" : true })
    .exec(function (err, venue) {
      if (err)
        console.log(err.stack);
      res.send(venue);
    });
});

api.delete('/:id', function(req, res) {
  Venues
    .findByIdAndRemove(req.params.id)
    .exec(function (err) {
      if (err)
        console.log(err.stack);
      res.send();
    })
});

module.exports = api;