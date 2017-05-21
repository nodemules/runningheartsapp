{
  function exports() {
    var moment = require('moment-timezone');

    var service = {
      getNextDays,
    }

    function getNextDays(dayOfWeek, weeks) {
      var days = [];
      for (var i = 0; i < weeks; i++) {
        var day = moment().day(getDayOfWeek(dayOfWeek) + (7 * i)).format();
        days.push(day);
      }
      return days;
    }

    function getDayOfWeek(dayName) {
      return moment(moment().day(dayName)).day();
    }

    return service;
  }
  module.exports = exports;

}
