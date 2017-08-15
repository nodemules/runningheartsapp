{
  function exports() {

    const MONGO_ERROR = 'MongoError';
    const MONGOOSE_VALIDATION_ERROR = 'ValidationError';

    var service = {
      handleError
    };

    function handleError(res, error) {
      if (!error) {
        res.send(500, {
          message: 'An error occurred'
        });
      }

      var handledError = {};
      var status = 500;
      switch (error.name) {
        case MONGO_ERROR:
          handledError = constructMongoError(error);
          break;
        case MONGOOSE_VALIDATION_ERROR:
          handledError = constructMongooseError(error);
          break;
        default:
          handledError = constructDefaultError(error);
          status = handledError.status;
          break;
      }
      res.send(status, handledError);

    }

    function constructDefaultError(error, status) {
      var handledError = {
        message: error.message,
        status: error.status || 406
      };
      if (handledError.status !== 500) {
        handledError.code = error.code;
      }
      return handledError;
    }

    function constructMongoError(error) {
      var handledError = {};
      var e = error.toJSON();
      switch (e.code) {
        case 11000:
          handledError = constructMongoDuplicateKeyError(error);
          break;
        default:
          break;
      }
      return handledError;
    }

    function constructMongoDuplicateKeyError(error) {
      var key = decodeDuplicateKeyError(error);
      var handledError = {
        message: `This ${key} is already in use.`
      };
      return handledError;
    }

    function decodeDuplicateKeyError(error) {
      var value = error.errmsg.match(/\{[^}]*\}/g).pop().match(/\"[^]*\"/g).pop().replace(/[^a-zA-Z ]+/g, '');
      return Object.keys(error.op).find(key => error.op[key] === value);
    }

    function constructMongooseError(error) {
      var handledError = {
        message: error.errors.name.message
      };

      return handledError;
    }

    return service;
  }

  module.exports = exports;

}
