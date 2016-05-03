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


module.exports = api;