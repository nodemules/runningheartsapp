{

  function exports() {

    const Environment = require('../app/enum/environments');

    var environment = {
      getName,
      getPort,
      setEnvironment
    };

    const DEFAULT_PORT = 8080;

    var ENV_NAME, ENV_PORT;

    function getPort() {
      return ENV_PORT;
    }

    function getName() {
      return ENV_NAME;
    }

    function setEnvironment(env) {
      ENV_NAME = env.NODE_ENV ? Environment.DEV : Environment.PROD;
      ENV_PORT = env.RHP_PORT || DEFAULT_PORT;
    }

    return environment;

  }

  module.exports = exports();
}
