var express = require('express'),
    api     = express.Router();
    passport = require('passport');
    require('../../config/passport')(passport);

var Venues  = require('../models/venue'),
    Users   = require('../models/user'),
    Players = require('../models/player'),
    Event   = require('../models/event'),
    Game    = require('../models/game');

api.get('/', function(req, res) {
  Users
    .find()
    .select('-statusId local.username usertype')
    .exec(function(err, user){
      if (err)
        console.log(err.stack);
      res.send(user);
    })
});

api.get('/:id', function(req, res) {
  Users
    .findById(req.params.id)
    .select('-statusId local.username usertype')
    .exec(function(err, user){
      if (err)
        console.log(err.stack);
      res.send(user);
    })
});

api.get('/type/:typeId', function(req, res, next) {
  Users
    .find({usertype: req.params.typeId})
    .select('-statusId local.username usertype player')
    .populate('player')
    .exec(function(err, users) {
        if (err)
            res.send(err);
        res.json(users);
    });
});

api.post('/login', passport.authenticate('local-login', function(req, res) {
  console.log("LOGIN ATTEMPT");
  //resume here... 
}));

api.post('/', function(req, res) {
  if (req.body._id) {
    Users
      .findOneAndUpdate({ _id : req.body._id }, req.body, { "new" : true })
      .select('-statusId')
      .exec(function (err, user) {
        if (err)
          console.log(err.stack);
        res.send(user);
      });
  } else {
    Users
      .create(req.body, function(err, user) {
        console.log(req.body);
        if (err)
          console.log(err.stack);
        res.send(user);
      });
  }
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
