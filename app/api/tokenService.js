{
  function exports() {

    const LOG = require('../../config/logging').getLogger();

    const errorService = require('./advice/errorService')();

    var Token = require('../models/token');

    var service = {
      validateToken,
      createToken
    };

    function validateToken(req, res, next) {
      Token
        .find({})
        .sort({
          createdAt: -1
        })
        .exec((err, token) => {
          if (err) {
            LOG.error(err);
            return errorService.handleError(res, err);
          }
          if (token[0].tokenId === req.body.tokenId) {
            next();
          } else {
            res.send(401, {
              message: 'Token Not Valid',
              code: 'INVALID_TOKEN',
              validated: false
            });
          }
        });
    }

    function createToken(req, res, next) {
      Token.create(req.body, (err) => {
        if (err) {
          LOG.error(err);
          return errorService.handleError(res, err);
        }
        next();
      });
    }

    return service;
  }

  module.exports = exports;
}
