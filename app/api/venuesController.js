{
  const LOG = require('../../config/logging').getLogger();

  const errorService = require('./advice/errorService');

  var express = require('express'),
    api = express.Router();

  var authService = require('./authService')(),
    Permissions = require('../enum/permissions'),
    venuesService = require('./venuesService')();

  var Venues = require('../models/venue');

  api.get('/', function(req, res) {
    venuesService.getVenues().then((venues) => {
      return res.send(venues);
    });
  });

  api.get('/count', function(req, res) {
    Venues
      .count({
        statusId: 1
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

  api.get('/:id', function(req, res) {
    Venues
      .findById(req.params.id)
      .populate('td')
      .select('-statusId')
      .exec(function(err, venue) {
        if (err) {
          LOG.error(err);
          return errorService.handleError(res, err);
        }
        return res.send(venue);
      });
  });

  api.post('/',
    (req, res, next) => {
      let permissions = [];
      permissions.push(req.body._id ? Permissions.EDIT_VENUE : Permissions.ADD_VENUE);
      authService.checkPermissions(req, res, next, permissions);
    },
    function(req, res) {
      if (req.body._id) {
        Venues
          .findOneAndUpdate({
            _id: req.body._id
          }, req.body, {
            'new': true
          })
          .select('-statusId')
          .exec(function(err, venue) {
            if (err) {
              LOG.error(err);
              return errorService.handleError(res, err);
            }
            return res.send(venue);
          });
      } else {
        Venues
          .create(req.body, function(err, venue) {
            if (err) {
              LOG.error(err);
              return errorService.handleError(res, err);
            }
            return res.send(venue);
          });
      }
    });

  api.put('/',
    (req, res, next) => authService.checkPermissions(req, res, next, [Permissions.EDIT_VENUE]),
    function(req, res) {
      Venues
        .findOneAndUpdate({
          _id: req.body._id
        }, req.body, {
          'new': true
        })
        .exec(function(err, venue) {
          if (err) {
            LOG.error(err);
            return errorService.handleError(res, err);
          }
          return res.send(venue);
        });
    });

  api.delete('/:id',
    (req, res, next) => authService.checkPermissions(req, res, next, [Permissions.DELETE_VENUE]),
    function(req, res) {
      req.body.statusId = 2;
      Venues
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
