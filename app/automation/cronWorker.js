{
  function exports(times) {
    var CronJob = require('cron').CronJob;
    var Automator = require('./Automator')();

    //Every day at midnight
    new CronJob(times.createNewEvents, function() {
      Automator.createNewEvents();

    }, null, true, 'America/New_York');

    //Every day at 6 a.m.
    new CronJob(times.completeEvents, function() {
      Automator.completeEvents();
    }, null, true, 'America/New_York');

  }
  module.exports = exports;
}
