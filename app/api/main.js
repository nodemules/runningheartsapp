var express = require('express'),
  api = express.Router();

var venuesController = require('./venuesController'),
  eventsController = require('./eventsController'),
  gamesController = require('./gamesController'),
  usersController = require('./usersController'),
  playersController = require('./playersController'),
  statsController = require('./statsController',
    seasonsController = require('./seasonsController'));


api.use(function(req, res, next) {
  console.log('Running Hearts API is baking...');
  next();
});

api.use('/venues', venuesController);
api.use('/events', eventsController);
api.use('/games', gamesController);
api.use('/players', playersController);
api.use('/users', usersController);
api.use('/stats', statsController);
api.use('/seasons', seasonsController);

module.exports = api;
