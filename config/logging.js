{
  function exports() {

    const log4js = require('log4js');
    const log4js_extend = require('log4js-extend');

    const env = require('./environment');

    const Environment = require('../app/enum/environments');
    const Level = log4js.levels;

    const DEFAULT_LOG_LEVEL = Level.INFO;

    log4js.configure({
      appenders: {
        default: {
          type: 'console',
          layout: {
            type: 'pattern',
            pattern: '%[%p %][%d{ISO8601}]%[ %m%]'
          }
        }
      },
      categories: {
        default: {
          level: DEFAULT_LOG_LEVEL,
          appenders: ['default']
        }
      }
    });

    // extend log4js to append file/line/method info
    log4js_extend(log4js, {
      path: __dirname,
      format: '\x1B[39m@name (@file:@line:@column)'
    });

    // define our custom logger
    const LOG = log4js.getLogger();
    // default to INFO level logging
    LOG.level = DEFAULT_LOG_LEVEL;

    // define our custom http request intereceptor logger
    const requestLogger = log4js.connectLogger(LOG, {
      level: 'auto',
      format: ':method :url :status :response-time ms - :res[content-length]',
      nolog: '\\.(gif|jpe?g|png|js|css|html?)'
    });

    function registerUncaughtExceptionHandler() {
      LOG.info('Registering uncaughtException handler');
      process.on('uncaughtException', function(err) {
        // log error then exit
        LOG.fatal(err);
        process.exit(1);
      });
    }

    function setLogLevel(env) {
      switch (env.getName()) {
        case Environment.DEV:
          LOG.level = Level.TRACE;
          break;
        case Environment.QA:
          LOG.level = Level.DEBUG;
          break;
        case Environment.PROD:
          LOG.level = Level.INFO;
          break;
        default:
          LOG.level = DEFAULT_LOG_LEVEL;
          break;
      }

      LOG.info('Environment loaded: [%s]', env.getName());
      LOG.info('Logging level is set to %s', LOG.level, {
        a: {
          b: [],
          c: 'd'
        }
      });

    }

    function getLogger() {
      return LOG;
    }

    function getRequestLogger() {
      return requestLogger;
    }

    function initialize() {
      registerUncaughtExceptionHandler();
      setLogLevel(env);
    }

    initialize();

    return {
      getLogger,
      getRequestLogger
    };

  }

  module.exports = exports();
}
