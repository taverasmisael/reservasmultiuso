class Utilities {
  constructor() {
    console.log('Instantiate Utilities Service');
  }
  fixDate(date) {
    let _date = moment(date);
    _date.set({
      hours: 12,
      minutes: 0,
      seconds: 0,
      milliseconds: 0
    });

    return _date;
  }
  fixTime(date, time) {
    let _time = moment(time);
    let _date = moment(date);
    _time.set({
      year: _date.year(),
      month: _date.month(),
      day: _date.date()
    });

    return _time;
  }
}

export default Utilities;
