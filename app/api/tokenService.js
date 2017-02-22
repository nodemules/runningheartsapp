{
  function exports() {
    var Token = require('../models/token');

    var service = {
      validateToken,
      createToken
    }

    function validateToken(req, res, next) {
      Token
        .find({})
        .sort({
          createdAt: -1
        })
        .exec((err, token) => {
          if (token[0].tokenId === req.body.tokenId) {
            next();
          } else {
            res.send(401, {
              message: 'Token Not Valid',
              validated: false
            })
          }
        })
    }

    function createToken(req, res, next) {
      Token.create(req.body, (err, tokens) => {
        next();
      })
    }

    return service;
  }

  module.exports = exports;
}
