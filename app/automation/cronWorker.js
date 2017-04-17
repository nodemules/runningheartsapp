{
  function exports() {
    var CronJob = require('cron').CronJob;
    var Automator = require('./Automator')();

    //Every day at midnight
    new CronJob('* * 0 * * *', function() {
      Automator.createNewEvents();

    }, null, true, 'America/New_York');

    //Every day at 6 a.m.
    new CronJob('0 0 6 * * *', function() {
      Automator.completeEvents();
    }, null, true, 'America/New_York');

  }
  module.exports = exports;
}
