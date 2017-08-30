{
  function exports() {

    const winston = require('winston');
    const winstonFormatter = require('winston-console-formatter');

    const env = require('./environment');

    // define our custom logger
    var logger = new winston.Logger({
      level: env.getName() === 'dev' ? 'silly' : 'info'
    });

    logger.add(winston.transports.Console, winstonFormatter.config());

    logger.info('Environment loaded: [%s]', env.getName());
    logger.info('Logging level is set to %s', logger.level);

    return logger;


  }

  module.exports = exports();
}
