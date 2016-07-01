var express = require('express'),
    api     = express.Router();

var Venues  = require('../models/venue'),
    Users   = require('../models/user'),
    Players = require('../models/player'),
    Event   = require('../models/event'),
    Game    = require('../models/game');

var publicPlayer = {
  path : 'user',
  select : 'local.username' 
}

api.get('/', function(req, res) {
  Players
    .find()
    .populate(publicPlayer)
    .exec(function(err, player){
      if (err)
        console.log(err.stack);
      res.send(player);
    })
});

api.get('/:id', function(req, res) {
  Players
    .findById(req.params.id)
    .populate(publicPlayer)
    .exec(function(err, player){
      if (err)
        console.log(err.stack);
      res.send(player);
    })
});

api.put('/', function(req, res){
  console.log(req.body);
  Players
    .find(req.body)
    .populate(publicPlayer)
    .exec(function(err, player){
      if (err)
        console.log(err.stack);
      res.send(player);
    })

})

api.post('/', function(req, res) {
  if (req.body._id) {
   Players
      .findByIdAndUpdate(req.body._id, req.body, { "new" : true })
      .exec(function(err, player) {
        if (err)
          console.log(err.stack);
        res.send(player);
      })
  } else {
    Players.create(req.body, function(err, player) {
      if (err)
        console.log(err.stack);
      res.send(player);
    });
  }
});

api.put('/', function(req, res) {
  Players
    .findByIdAndUpdate(req.body._id, req.body, { "new" : true })
    .exec(function(err, player) {
      if (err)
        console.log(err.stack);
      res.send(player);
    })
});

api.delete('/:id', function(req, res) {
  Players
    .findByIdAndRemove(req.params.id)
    .exec(function(err) {
      if (err) {
        console.log(err.stack);
        res.status(500).send();
      } else {
        res.send();
      }
    })
})

module.exports = api;