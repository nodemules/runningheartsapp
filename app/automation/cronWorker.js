{
  function exports() {
    var CronJob = require('cron').CronJob;
    var Automator = require('./Automator')();

    //Dev: running every minute
    new CronJob('* * 0 * * *', function() {
      Automator.createNewEvents();

    }, null, true, 'America/New_York');

  }
  module.exports = exports;
}
