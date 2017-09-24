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
      ENV_PORT = env.RHP_PORT || DEFAULT_PORT;
      setName(env.NODE_ENV);
    }

    function setName(name) {
      switch (name) {
        case 'production':
          ENV_NAME = Environment.PRODUCTION;
          break;
        case 'qa':
          ENV_NAME = Environment.QA;
          break;
        default:
          ENV_NAME = Environment.DEV;
          break;

      }
    }

    return environment;

  }

  module.exports = exports();
}
