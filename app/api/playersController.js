{
  var express = require('express'),
    api = express.Router();

  var authService = require('./authService')(),
    Permissions = require('../enum/permissions'),
    Players = require('../models/player');

  var publicPlayer = {
    path: 'user',
    select: 'local.username'
  }

  api.get('/',
    (req, res) => {
      Players
        .find({
          statusId: 1
        })
        .select('-statusId')
        .exec((err, player) => {
          if (err)
            console.log(err.stack);
          res.send(player);
        })
    })

  api.get('/count', (req, res) => {
    Players
      .count({
        statusId: 1
      })
      .exec((err, count) => {
        if (err)
          res.send(err);
        res.send({
          count: count
        })
      })
  })

  api.get('/:id', (req, res) => {
    Players
      .findById(req.params.id)
      .populate(publicPlayer)
      .select('-statusId')
      .exec((err, player) => {
        if (err)
          console.log(err.stack);
        res.send(player);
      })
  })

  /**
   * @name findBy
   *
   * @description This query will return all player documents that match the search terms
   * provided in the request body, returning only players that have not
   * been soft deleted
   * TODO - Determine permission level, potentially admin
   *
   * @param req.body
   * @return [players]
   */
  api.put('/',
    (req, res, next) => {
      authService.checkPermissions(req, res, next, [Permissions.VIEW_DIRECTORS]);
    },
    function(req, res) {
      req.body.statusId = 1;
      Players
        .find(req.body)
        .select('-statusId')
        .exec(function(err, players) {
          if (err)
            console.log(err.stack);
          res.send(players);
        })

    })

  api.put('/notIn', function(req, res) {
    Players
      .find({
        _id: {
          '$nin': req.body.players
        }
      })
      .select('-statusId')
      .exec(function(err, players) {
        if (err)
          console.log(err.stack);
        res.send(players);
      })
  })

  api.put('/:id/shoutOut', function(req, res) {
    Players
      .findByIdAndUpdate({
        _id: req.params.id
      }, {
        $inc: {
          shoutOuts: 1
        }
      }, {
        'new': true
      })
      .exec(function(err, player) {
        if (err)
          console.log(err.stack);
        res.send(player);
      })
  })

  api.post('/',
    (req, res, next) => {
      let permissions = [];
      permissions.push(req.body._id ? Permissions.EDIT_PLAYER : Permissions.ADD_PLAYER);
      authService.checkPermissions(req, res, next, permissions);
    },
    (req, res) => {
      if (req.body._id) {
        Players
          .findByIdAndUpdate(req.body._id, req.body, {
            'new': true
          })
          .select('-statusId')
          .exec((err, player) => {
            if (err)
              console.log(err.stack);
            res.send(player);
          })
      } else {
        Players.create(req.body, (err, player) => {
          if (err)
            console.log(err.stack);
          res.send(player);
        });
      }
    });

  api.put('/',
    (req, res, next) => authService.checkPermissions(req, res, next, [Permissions.EDIT_PLAYER]),
    function(req, res) {
      Players
        .findByIdAndUpdate(req.body._id, req.body, {
          'new': true
        })
        .exec(function(err, player) {
          if (err)
            console.log(err.stack);
          res.send(player);
        })
    });

  api.delete('/:id',
    (req, res, next) => authService.checkPermissions(req, res, next, [Permissions.DELETE_PLAYER]),
    function(req, res) {
      req.body.statusId = 2;
      Players
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
}
