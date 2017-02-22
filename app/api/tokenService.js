{
  function exports() {
    var Token = require('../models/token');

    var service = {
      validateToken
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
            res.send({
              message: 'Token Not Valid',
              validated: false
            })
          }
        })
    }

    return service;
  }

  module.exports = exports;
}
