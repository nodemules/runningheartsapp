var express = require('express');
var api = express.Router();
var Venues = require('../models/venue');
var Users = require('../models/user');

api.use(function(req, res, next) {
	console.log('Running Hearts API is baking...');
	next(); 
});

//========================
//Add Modify Venues ======
//========================

api.get('/venues', function(req, res, next) {
	Venues.find(function(err, venues) {
		if (err)
			res.send(err);
		res.json(venues);
	});
});

api.post('/venues', function(req, res) {
    Venues.create(req.body, function(err, venue) {
        if (err)
            res.send(err);
        res.send(venue);
    });

});

api.get('/venues/:venueId', function(req, res, next) {
    Venues.findById(req.params.venueId, function(err, venue) {
        if (err)
            res.send(err);
        res.json(venue);
    });
});

api.put('/venues', function(req, res){
    Venues.findOneAndUpdate({_id:req.body.venueId}, req.body, function (err, venue) {
    if (err)
        res.send(err);
    res.send(venue);
    });
});

//========================
//Add Modify Players =====
//========================

//TODO: need to setup a loop here to only return the usernames, otherwise we are sending their pass, usertype etc.
api.get('/players', function(req, res, next) {
    console.log('get players..');
    Users.find(function(err, players) {
        if (err)
            res.send(err);
        res.json(players);
    });
});

api.post('/players', function(req, res) {
    Users.create(req.body, function(err, player) {
        if (err)
            res.send(err);
        res.send(player);
    });

});

api.put('/players', function(req, res){
    Users.findOneAndUpdate({'local.username': req.body.user}, req.body, function (err, user) {
    if (err)
        res.send(err);
    res.send(user);
    });
});

module.exports = api;