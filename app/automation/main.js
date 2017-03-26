{
  function exports() {
    var cronWorker = require('./cronWorker');

    //Run cron job
    cronWorker();
  }
  module.exports = exports;
}
