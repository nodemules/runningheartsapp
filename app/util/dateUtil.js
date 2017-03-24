{
  function exports() {

    var service = {
      getNextDayOfWeek,
      getNextDays,
      getDayByName
    }

    function getNextDayOfWeek(dayOfWeek) {

      var resultDate = new Date();
      resultDate.setDate(resultDate.getDate() + (7 + dayOfWeek - resultDate.getDay()) % 7);
      return resultDate;

    }

    function getNextDays(dayOfWeek, weeks) {
      var days = [];
      var nextDay = getNextDayOfWeek(dayOfWeek);
      days.push(nextDay);
      for (var i = 1; i < weeks; i++) {
        var day = new Date();
        day.setDate(nextDay.getDate() + 7 * i)
        days.push(day);
      }
      return days;
    }

    function getDayByName(name) {
      switch (name.toUpperCase()) {
        case 'SUNDAY':
          return 0
        case 'MONDAY':
          return 1
        case 'TUESDAY':
          return 2
        case 'WEDNESDAY':
          return 3
        case 'THURSDAY':
          return 4
        case 'FRIDAY':
          return 5
        case 'SATURDAY':
          return 6
        default:
          return 'TWILIGHT ZONE'
      }
    }

    return service;
  }
  module.exports = exports;

}
