{
  function exports() {

    var service = {
      handleError
    };

    function handleError(res, error) {
      if (!error) {
        res.send(500, {
          message: 'An error occurred'
        });
      }
      var status = error.status || 406;
      var handledError = {
        message: error.message
      };
      if (status !== 500) {
        handledError.code = error.code;
      }
      return res.send(status, handledError);
    }

    return service;
  }

  module.exports = exports;

}
