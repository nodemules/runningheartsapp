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
    .find({ statusId : 1 })
    .populate(publicPlayer)
    .select('-statusId')
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
    .select('-statusId')
    .exec(function(err, player){
      if (err)
        console.log(err.stack);
      res.send(player);
    })
});

api.put('/', function(req, res){
  req.body.statusId = 1;
  Players
    .find(req.body)
    .select('-statusId')
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
      .select('-statusId')
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
  req.body.statusId = 2;
  Players
    .findByIdAndUpdate(req.params.id, req.body)
    .exec(function (err) {
      if (err) {
        console.log(err.stack);
        res.send(500, err.stack);
      }
      res.send();
    })
})

module.exports = api;