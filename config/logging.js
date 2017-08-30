{
  function exports() {

    const log4js = require('log4js');
    const log4js_extend = require('log4js-extend');

    log4js_extend(log4js, {
      path: __dirname,
      format: '| @name (@file:@line:@column)'
    });

    const env = require('./environment');

    // define our custom logger
    var logger = log4js.getLogger();
    logger.level = env.getName() === 'dev' ? 'debug' : 'info';

    logger.info('Environment loaded: [%s]', env.getName());
    logger.info('Logging level is set to %s', logger.level);

    return logger;


  }

  module.exports = exports();
}
