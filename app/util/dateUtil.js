{
  function exports() {
    var moment = require('moment-timezone');

    var service = {
      getNextDays
    }

    function getNextDays(dayOfWeek, weeks) {
      var startNextWeek = moment().day(getDayOfWeek(dayOfWeek)).isBefore(moment().format());
      var days = [];
      for (var i = 0; i < weeks; i++) {
        var day = moment().day(getDayOfWeek(dayOfWeek) + (7 * i) + (startNextWeek ? 7 : 0)).set({
          hour: 19,
          minute: 30,
          second: 0,
          millisecond: 0
        }).format();
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
