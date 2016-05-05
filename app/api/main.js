var express = require('express');
var api = express.Router();
var Venues = require('../models/venue');

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


module.exports = api;