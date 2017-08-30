{

  function exports() {

    var environment = {
      getName,
      getPort,
      setEnvironment
    };

    var ENV_NAME, ENV_PORT;

    function getPort() {
      return ENV_PORT;
    }

    function getName() {
      return ENV_NAME;
    }

    function setEnvironment(env) {
      ENV_NAME = env.npm_config_dev ? 'dev' : 'prod';
      ENV_PORT = env.RHP_PORT || '8080';
    }

    return environment;

  }

  module.exports = exports();
}
