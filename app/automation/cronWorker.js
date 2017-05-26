{
  function exports() {
    var CronJob = require('cron').CronJob;
    var Automator = require('./Automator')();
    var configuration = require('../../config/configuration.js')

    //Every day at midnight
    new CronJob(configuration.createEventTime, function() {
      Automator.createNewEvents();

    }, null, true, 'America/New_York');

    //Every day at 6 a.m.
    new CronJob(configuration.completeEventTime, function() {
      Automator.completeEvents();
    }, null, true, 'America/New_York');

  }
  module.exports = exports;
}
