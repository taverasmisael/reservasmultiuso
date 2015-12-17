(function() {
  'use strict';

  angular
    .module('mtUtilities', [])
    .service('Utilities', Utilities);

  function Utilities() {
    var UtilitiesService = {
      date: {
        fix: fixMilliseconds
      },
      time: {
        setDate: fixDate
      }
    };

    return UtilitiesService;


    function fixMilliseconds (date) {
      var _date = new Date(date);
      _date.setHours(12);
      _date.setMinutes(0);
      _date.setMilliseconds(0);
      _date.setSeconds(0);

      return _date;
    }

    function fixDate (date, time) {
      var _time = moment(time);
      _time.set({year: date.getFullYear(), month: date.getMonth(), day: date.getDate()});

      return _time;
    }
  }
}());
