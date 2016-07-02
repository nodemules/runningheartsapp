var express = require('express'),
    api     = express.Router();

var Venues  = require('../models/venue'),
    Users   = require('../models/user'),
    Players = require('../models/player'),
    Event   = require('../models/event'),
    Game    = require('../models/game');

api.get('/', function(req, res) {
  Users
    .find()
    .select('local.username usertype')
    .exec(function(err, user){
      if (err)
        console.log(err.stack);
      res.send(user);
    })
});

api.get('/:id', function(req, res) {
  Users
    .findById(req.params.id)
    .select('local.username usertype')
    .exec(function(err, user){
      if (err)
        console.log(err.stack);
      res.send(user);
    })
});

api.get('/type/:typeId', function(req, res, next) {
  Users
    .find({usertype: req.params.typeId})
    .select('local.username usertype player')
    .populate('player')
    .exec(function(err, users) {
        if (err)
            res.send(err);
        res.json(users);
    });
});

api.put('/', function(req, res){
  Users
    .findOneAndUpdate({_id: req.body._id}, req.body, { "new" : true }) 
    .exec(function (err, user) {
      if (err)
          res.send(err);
      res.send(user);
    });
});

api.delete('/:id', function(req, res) {
  req.body.statusId = 2;
  Users
    .findByIdAndUpdate(req.params.id, req.body)
    .exec(function (err) {
      if (err) {
        console.log(err.stack);
        res.send(500, err.stack);
      }
      res.send();
    })
});


module.exports = api;