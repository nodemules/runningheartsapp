{
  function exports(configuration) {
    var cronWorker = require('./cronWorker');

    //Run cron job
    cronWorker(configuration.cron);
  }
  module.exports = exports;
}
