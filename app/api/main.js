var express = require('express');
var api = express.Router();
var Venues = require('../models/venue');
var Users = require('../models/user');
var Players = require('../models/player');

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

//TODO: need to setup a loop here to only return the usernames, otherwise we are sending their pass, usertype etc.
api.get('/tds', function(req, res, next) {
    Users.find({usertype: 2}, function(err, tds) {
        if (err)
            res.send(err);
        res.json(tds);
    });
});

//========================
//Add Modify Players =====
//========================

//TODO: need to setup a loop here to only return the usernames, otherwise we are sending their pass, usertype etc.
api.get('/players', function(req, res, next) {
    Players
        .find()
        .populate('user')
        .exec(function(err, player){
            if (err)
                res.send(err);
            res.send(player);
        })
});

api.post('/players', function(req, res) {
    Players.create(req.body, function(err, player) {
        if (err)
            res.send(err);
        res.send(player);
    });

});

api.put('/user', function(req, res){
    Users.findOneAndUpdate({_id: req.body._id}, req.body, function (err, user) {
    if (err)
        res.send(err);
    res.send(user);
    });
});

module.exports = api;