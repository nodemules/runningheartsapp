var express = require('express'),
  api = express.Router();

var authService = require('./authService')(),
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
  }]
  Game
    .find({
      statusId: 1
    })
    .populate(pOptions)
    .select('-statusId')
    .exec(function(err, games) {
      if (err)
        res.send(err);
      res.send(games);
    })
})

api.get('/date', function(req, res) {
  var startDate = new Date(req.query.startDate);
  startDate = startDate.setHours(0, 0, 0, 0);
  var endDate;
  if (req.query.endDate) {
    endDate = new Date(req.query.endDate);
  } else {
    endDate = new Date(startDate);
  }
  endDate = endDate.setHours(23, 59, 59, 999)

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
  }]
  Game
    .find({
      date: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      },
      statusId: 1
    })
    .populate(pOptions)
    .select('-statusId')
    .exec(function(err, games) {
      if (err)
        res.send(err);
      console.log(games);
      res.send(games);
    })
})

api.get('/:id', function(req, res) {
  var pOptions = [{
    path: 'event',
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
  }]
  Game
    .findById(req.params.id)
    .populate(pOptions)
    .select('-statusId')
    .exec(function(err, games) {
      if (err)
        res.send(err);
      res.send(games);
    })
})

api.get('/count', function(req, res) {
  Game
    .count({
      statusId: 1,
      completed: true
    })
    .exec(function(err, count) {
      if (err)
        res.send(err);
      res.send({
        count: count
      })
    })
})

api.post('/',
  (req, res, next) => authService.checkPermissions(req, res, next, [Permissions.PLAY_GAME]),
  function(req, res) {
    if (req.body._id) {
      var pOptions = [{
        path: 'event',
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
      }]
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
          if (err)
            res.send(err);
          res.send(game);
        })
    } else {
      Game.create(req.body, function(err, game) {
        if (err) {
          console.log(err.stack);
          res.status(500).send();
        } else {
          Event
            .findOne({
              _id: game['event']
            })
            .exec(function(err, e) {
              if (err)
                console.log(err.stack);
              e.games.push(game._id);
              e.save();
              res.send(game);
            })
        }
      })
    }
  })

api.put('/', (req, res, next) => authService.checkPermissions(req, res, next, [Permissions.MODIFY_FINISHED_GAME]),
  function(req, res) {
    Game
      .findOneAndUpdate({
        _id: req.body._id
      }, req.body, {
        'new': true
      })
      .exec(function(err, game) {
        if (err)
          res.send(err);
        res.send(game);
      })
  })

api.delete('/:id', (req, res, next) => authService.checkPermissions(req, res, next, [Permissions.DELETE_GAME]), function(req, res) {
  req.body.statusId = 2;
  Game
    .findByIdAndUpdate(req.params.id, req.body)
    .exec(function(err) {
      if (err) {
        console.log(err.stack);
        res.send(500, err.stack);
      }
      res.send();
    })
})

module.exports = api;
