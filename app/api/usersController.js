{

  const LOG = require('../../config/logging').getLogger();

  var express = require('express'),
    api = express.Router(),
    passport = require('passport');

  const errorService = require('./advice/errorService');

  var authService = require('./authService')(),
    tokenService = require('./tokenService')(),
    Permissions = require('../enum/permissions'),
    Users = require('../models/user');

  api.get('/', function(req, res) {
    Users
      .find()
      .select('-statusId local.username usertype')
      .exec(function(err, user) {
        if (err) {
          LOG.error(err);
          return errorService.handleError(res, err);
        }
        return res.send(user);
      });
  });

  api.get('/:id',
    (req, res, next) => authService.checkPermissions(req, res, next, [Permissions.VIEW_USER_DETAILS]),
    (req, res) => {
      Users
        .findById(req.params.id)
        .exec((err, user) => {
          if (err) {
            LOG.error(err);
            return errorService.handleError(res, err);
          }
          return res.send(user);
        });
    });

  api.get('/type/:typeId', function(req, res) {
    Users
      .find({
        usertype: req.params.typeId
      })
      .select('-statusId local.username usertype player')
      .populate('player')
      .exec(function(err, users) {
        if (err) {
          LOG.error(err);
          return errorService.handleError(res, err);
        }
        return res.json(users);
      });
  });

  api.post('/login', passport.authenticate('local'), function(req, res) {
    return res.send(res.req.session);
  });

  /**
   * TODO - This endpoint contains a prototype & experimental permissions
   * check and should be tested & refactored ASAP - brent 1/8/17
   */
  api.post('/',
    (req, res, next) => {
      let permissions = [];
      LOG.info('Creating or modifying a user...');
      LOG.info(`User is logged in [${authService.isAuth(req)}]`);
      if (req.body._id) {
        switch (req.body._id) {
          case !undefined:
            LOG.info(`User is editing a User [${(req.body._id)}]`);
            break;
          case req.user._id:
            LOG.info(`User is modifying own User [${(req.body._id === req.user._id)}]`);
            break;
          default:
            LOG.info('User is creating a new user');
            break;
        }
        if (authService.isAuth(req)) {
          permissions.push(req.body._id ? Permissions.EDIT_USER : Permissions.ADD_USER);
          authService.checkPermissions(req, res, next, permissions);
        } else if (req.body._id === req.user._id) {
          permissions.push(Permissions.EDIT_OWN_USER);
          authService.checkPermissions(req, res, next, permissions);
        } else if (req.body._id) {
          permissions.push(Permissions.EDIT_USER);
          authService.checkPermissions(req, res, next, permissions);
        }
      } else {
        next();
      }
    },
    tokenService.validateToken,
    function(req, res) {
      if (req.body._id) {
        Users
          .findOneAndUpdate({
            _id: req.body._id
          }, req.body, {
            'new': true
          })
          .select('-statusId')
          .exec(function(err, user) {
            if (err) {
              LOG.error(err);
              return errorService.handleError(res, err);
            }
            return res.send(user);
          });
      } else {
        //make all usernames lowercase in Db for login ease
        req.body.username = req.body.username.toLowerCase();
        Users
          .create(req.body, function(err, user) {
            if (err) {
              var errorResponse = {};
              if (err.code === 11000) {
                errorResponse.message = `Cannot create a user [${req.body.username}] that already exists`;
                errorResponse.code = 'DUPLICATE_KEY_ERROR';
              }
              return res.send(401, errorResponse);

            }
            return res.send(user);
          });
      }
    });

  api.put('/', function(req, res) {
    Users
      .findOneAndUpdate({
        _id: req.body._id
      }, req.body, {
        'new': true
      })
      .exec(function(err, user) {
        if (err) {
          LOG.error(err);
          return errorService.handleError(res, err);
        }
        return res.send(user);
      });
  });

  api.delete('/:id', function(req, res) {
    req.body.statusId = 2;
    Users
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
