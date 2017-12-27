{

  const LOG = require('../../config/logging').getLogger();

  const errorService = require('./advice/errorService')();

  var express = require('express'),
    api = express.Router();

  var authService = require('./authService')(),
    gamesService = require('./gamesService')(),
    Permissions = require('../enum/permissions'),
    Event = require('../models/event'),
    Game = require('../models/game');

  api.get('/', function(req, res) {
    var pOptions = [{
      path: 'event',
      select: 'venue td date',
      populate: [{
        path: 'venue',
        select: 'name day'
      }, {
        path: 'td',
        select: 'name user',
        populate: {
          path: 'user',
          model: 'User',
          select: 'username'
        }
      }]
    }];
    Game
      .find({
        statusId: { '$in': [1,3]}
      })
      .populate(pOptions)
      .select('-statusId')
      .exec(function(err, games) {
        if (err) {
          LOG.error(err);
          return errorService.handleError(res, err);
        }
        return res.send(games);
      });
  });

  api.get('/date', function(req, res) {
    gamesService.byDate(req.query.startDate, req.query.endDate).then(function(games) {
      res.send(games);
    }, (err) => errorService.handleError(res, err));
  });

  api.get('/:id', function(req, res) {
    var pOptions = [{
      path: 'event',
      populate: [{
        path: 'venue',
        select: 'name day numberOfGames'
      }, {
        path: 'td',
        select: 'name user',
        populate: {
          path: 'user',
          model: 'User',
          select: 'username'
        }
      }, {
        path: 'games',
        select: 'event number'
      }]
    }, {
      path: 'players',
      populate: {
        path: 'player',
        select: 'name isTd'
      }
    }];
    Game
      .find({
        _id: req.params.id,
        statusId: {'$in': [1,3]}
      })
      .populate(pOptions)
      .select('-statusId')
      .exec(function(err, games) {
        if (err) {
          LOG.error(err);
          return errorService.handleError(res, err);
        }
        return res.send(games[0]);
      });
  });

  api.get('/count', function(req, res) {
    Game
      .count({
        statusId: 1,
        completed: true
      })
      .exec(function(err, count) {
        if (err) {
          LOG.error(err);
          return errorService.handleError(res, err);
        }
        return res.send({
          count: count
        });
      });
  });

  api.post('/',
    (req, res, next) => authService.checkPermissions(req, res, next, [Permissions.PLAY_GAME]),
    function(req, res) {
      if (req.body._id) {
        var pOptions = [{
          path: 'event',
          populate: [{
            path: 'venue',
            select: 'name day numberOfGames'
          }, {
            path: 'td',
            select: 'name user',
            populate: {
              path: 'user',
              model: 'User',
              select: 'username'
            }
          }, {
            path: 'games',
            select: 'event number'
          }]
        }, {
          path: 'players',
          populate: {
            path: 'player',
            select: 'name isTd'
          }
        }];
        Game
          .findOneAndUpdate({
            _id: req.body._id,
            completed: false
          }, req.body, {
            'new': true
          })
          .populate(pOptions)
          .select('-statusId')
          .exec(function(err, game) {
            if (err) {
              LOG.error(err);
              return errorService.handleError(res, err);
            }
            return res.send(game);
          });
      } else {
        Game.create(req.body, function(err, game) {
          if (err) {
            LOG.error(err);
            return errorService.handleError(res, err);
          }
          Event
            .findOne({
              _id: game['event']
            })
            .exec(function(err, e) {
              if (err) {
                LOG.error(err);
                return errorService.handleError(res, err);
              }
              e.games.push(game._id);
              e.save();
              return res.send(game);
            });
        });
      }
    });

  api.put('/', (req, res, next) => authService.checkPermissions(req, res, next, [Permissions.MODIFY_FINISHED_GAME]),
    function(req, res) {
      Game
        .findOneAndUpdate({
          _id: req.body._id
        }, req.body, {
          'new': true
        })
        .exec(function(err, game) {
          if (err) {
            LOG.error(err);
            return errorService.handleError(res, err);
          }
          return res.send(game);
        });
    });

  api.delete('/:id', (req, res, next) => authService.checkPermissions(req, res, next, [Permissions.DELETE_GAME]),
    function(req, res) {
      req.body.statusId = 2;
      Game
        .findByIdAndUpdate(req.params.id, req.body)
        .exec(function(err) {
          if (err) {
            LOG.error(err);
            return errorService.handleError(res, err);
          }
          return res.send();
        });
    });

  module.exports = api;
}
