{
  /* global Enum */

  function exports() {

    var environments = ['dev', 'qa', 'prod'];

    function getEnvironments() {
      var envs = {};
      environments.forEach((env) => {
        envs[env.toUpperCase()] = env;
      });
      return envs;
    }

    return new Enum(getEnvironments());
  }

  module.exports = exports();
}
