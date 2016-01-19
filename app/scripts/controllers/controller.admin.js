const timepickerOptions = {
  scrollDefault: '8:00am',
  minTime: '8:00am',
  maxTime: '8:00pm',
  forceRoundTime: true
};

class AdminController {
  constructor($scope, $mdToast, $filter, Utilities, Reservaciones, Search, Profesores) {
    this.$mdToast = $mdToast;
    this.$filter = $filter;
    this.Utilities = Utilities;
    this.Reservaciones = Reservaciones;
    this.Search = Search;
    this.Profesores = Profesores;

    this.profesorsList = Profesores.all();

    this.active();

    $scope.$watch(() => {
      return this.newReservationData.ends;
    }, (ov, nv) => {
      if (ov || nv) {
        this.creationForm.$setValidity('confirmTime', false);
      }
    });
  }

  active() {
    console.log('Administrating...');
    console.log(this.profesorsList);
    this.today = new Date();
    this.exceptionMode = false;
    _mdDatePickerFix();
    this.newReservationData = {};
    this.minReservationDate = moment().subtract(2, 'day')._d;
    $('#newReservationDataStarts').timepicker(timepickerOptions);
    $('#newReservationDataEnds').timepicker(timepickerOptions);
  }

  checkAvailability(date, start, end) {
    start = this.$filter('amParse')(start, 'HH:mmA');
    end = this.$filter('amParse')(end, 'HH:mmA');
    this.Search.checkAvailability(date, start, end)
      .then(message => {
        this.creationForm.$setValidity('confirmTime', true);
        this.creationForm.$setValidity('endTime', true);
        this.creationForm.$setValidity('startTime', true);
      })
      .catch(err => {
        console.info(err);
        if (err.message.name === 'ENDS_TOO_LATE') {
          this.creationForm.$setValidity('endTime', false);
        } else if (err.message.name === 'START_AT_SAME_TIME') {
          this.creationForm.$setValidity('startTime', false);
        } else {
          this.creationForm.$setValidity('confirmTime', false);
          this.creationForm.$setValidity('endTime', true);
          this.creationForm.$setValidity('startTime', true);
        }
      });
  }

  exonerate() {
    this.creationForm.$invalid = false;
    this.exceptionMode = true;
  }

  fillSections() {
    if (this.nrd && this.nrd.profesor) {
      this.newReservationData.section = '';
      this.availableSections = this.nrd.profesor.secciones;
    }
  }

  queryProfesors(profesorName) {
    let response = profesorName ?
          this.profesorsList.filter(_createFilterFor(profesorName)) :
          this.profesorsList;
    return response;
  }

  createReservacion(reservationData, nrdProfesor) {
    let newReservation = this._transformData(reservationData);
    this.Reservaciones.create(newReservation, nrdProfesor, this.exceptionMode)
      .then(() => {
        let fromNow = moment().to(newReservation.date);
        this.$mdToast.show(
            this.$mdToast.simple()
            .content(`Reservacion ${fromNow}`))
          .position('right bottom');
        this.newReservationData = {};
        this.selectedProfesor = {};
      }).catch(_errHdlr);
  }
  _transformData(data) {
    let filteredTimes = {
      starts: this.$filter('amParse')(data.starts, 'HH:mmA'),
      ends: this.$filter('amParse')(data.ends, 'HH:mmA')
    };

    let {starts, ends} = filteredTimes;

    data.date = this.Utilities.fixDate(data.date);
    data.starts = this.Utilities.fixTime(data.date, starts);
    data.ends = this.Utilities.fixTime(data.date, ends);
    data.materia = _getSelectedSection().materia;

    return data;
  }
}

AdminController.$inject = ['$scope', '$mdToast', '$filter', 'Utilities',
'Reservaciones', 'Search', 'Profesores'];

export default AdminController;

/**
 * This Function Add trigger on .md-datapicker-input-container:focus
 */
function _mdDatePickerFix() {
  setTimeout(function() {
    let datePicker = $('.md-datepicker-input-container');
    let datePickerInput = datePicker.find('input');
    let datePickerButton = datePicker.find('button');
    datePickerInput.on('focus', function(event) {
      event.preventDefault();
      datePickerButton.trigger('click');
    });
  }, 250);
}

/**
 * Function For Filtering Profesors
 * @param  {String} query the Profesor Name
 * @return {Boolean}       Returns if the Profesor was found
 */
function _createFilterFor(query) {
  let capitalcaseQuery = query.charAt(0).toUpperCase() + query.slice(1).toLowerCase();
  return function filterFn(profesor) {
    return (profesor.name.indexOf(capitalcaseQuery) === 0) ||
           (profesor.lastname.indexOf(capitalcaseQuery) === 0);
  };
}

/**
 * Return `materia` for the selected Section number
 * @return {Boolean} Returns if found the section
 */
function _getSelectedSection() {
  return this.availableSections.filter(function(seccion) {
    return seccion.id === this.newReservationData.section;
  });
}

/**
 * Just Log Errors From Promise in console
 * @param  {Error} err An error returned by a Promise
 */
function _errHdlr(err) {
  console.error(err);
}
