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

    Venues.create({
        name : req.body.name,
        day  : req.body.day,
        td   : req.body.td
    }, function(err, venue) {
        if (err)
            res.send(err);

        Venues.find(function(err, venues) {
            if (err)
                res.send(err)
            res.json(venues);
        });
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
    console.log(req.body.venueId);
    Venues.findById(req.body.venueId, function(err, venue){
         if (err)
            res.send(err);
        
        venue.td = req.body.td;
        venue.name = req.body.name;
        venue.day = req.body.day;

        venue.save(function(err) {
            if (err)
                res.send(err);
        });
        res.send(venue);
    })
});


module.exports = api;