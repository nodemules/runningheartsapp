var express = require('express'),
    api     = express.Router();
    
var venuesController  = require('./venuesController'),
    eventsController  = require('./eventsController'),
    gamesController   = require('./gamesController'),
    playersController = require('./playersController');


api.use(function(req, res, next) {
	console.log('Running Hearts API is baking...');
	next(); 
});

api.use('/venues', venuesController);
api.use('/events', eventsController);
api.use('/games', gamesController);
api.use('/players', playersController)

var Venues  = require('../models/venue'),
    Users   = require('../models/user'),
    Players = require('../models/player'),
    Event   = require('../models/event'),
    Game    = require('../models/game');

//TODO: need to setup a loop here to only return the usernames, otherwise we are sending their pass, usertype etc.
api.get('/tds', function(req, res, next) {
  Users
    .find({usertype: 2})
    .populate('player')
    .exec(function(err, tds) {
        if (err)
            res.send(err);
        res.json(tds);
    });
});

//========================
//Add Modify Players =====
//========================

api.put('/user', function(req, res){
    Users.findOneAndUpdate({_id: req.body._id}, req.body, function (err, user) {
    if (err)
        res.send(err);
    res.send(user);
    });
});

module.exports = api;