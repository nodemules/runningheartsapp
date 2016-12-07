{
  function exports() {
    var service = {
      auth
    }

    function auth(req, res, next) {
      console.log("Checking if user is logged in...");
      console.log(req.sessionID ? `Session found for ${req.sessionID}` : `No session found.`);
      console.log(req.isAuthenticated() ? `Session is authenticated` : `Session is not authenticated`);

      if (!req.isAuthenticated()) {
        res.send(401);
      } else
        next();
    };

    return service;
  }

  module.exports = exports;
}
