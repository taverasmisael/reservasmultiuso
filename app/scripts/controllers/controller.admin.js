const timepickerOptions = {
  'scrollDefault': '8:00am',
  'minTime': '8:00am',
  'maxTime': '8:00pm',
  'forceRoundTime': true
};

class AdminController {
  constructor($scope, $mdToast, $filter, Utilities, Reservaciones, Search, Profesores) {
    this.$mdToast = $mdToast;
    this.$filter = $filter;
    this.Utilities = Utilities;
    this.Reservaciones = Reservaciones;
    this.Search = Search;
    this.Profesores = Profesores;

    this.profesorsList = Profesores.all;

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
    this.today = new Date();
    this.exceptionMode = false;
    _mdDatePickerFix();
    this.newReservationData = {}
    this.minReservatinoDate = moment().subtract(2, 'day')._d;
    $('#newReservationDataStarts').timepicker(timepickerOptions);
    $('#newReservationDataEnds').timepicker(timepickerOptions);
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
    let response = profesorName ? this.profesorsList.filter(_createFilterFor(profesorName)) : this.profesorsList;
    return response;
  }

  createReservacion(reservationData, nrdProfesor) {
    let newReservation = _transformData(reservationData);
    this.Reservaciones.create(newReservation, nrdProfesor, this.exceptionMode)
      .then(() => {
        let fromNow = moment().to(newReservatino.date);
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
      starts: this.$filter('amParse')(data.starts, 'HH:mmA')
      ends: this.$filter('amParse')(data.ends, 'HH:mmA')
    };

    let { starts, ends } = filteredTimes;

    data.date = this.Utilities.fixDate(data.date);
    data.starts = this.Utilities.fixTime(data.date, starts);
    data.ends = this.Utilities.fixTime(data.date, starts);
    data.materia = _getSelectedSection().materia;

    return data;
  }
}

AdminController.$inject = ['$scope', '$mdToast', '$filter', 'Utilities', 'Reservaciones', 'Search', 'Profesores'];

export AdminController;

function _mdDatePickerFix() {
  setTimeout(function() {
    let datePicker = $('.md-datepicker-input-container'),
      datePickerInput = datePicker.find('input'),
      datePickerButton = datePicker.find('button');
    datePickerInput.on('focus', function(event) {
      event.preventDefault();
      datePickerButton.trigger('click');
    });
  }, 250);
}

function _createFilterFor(query) {
  let capitalcaseQuery = query.charAt(0).toUpperCase() + query.slice(1).toLowerCase();
  return function filterFn(profesor) {
    return (profesor.name.indexOf(capitalcaseQuery) === 0) || (profesor.lastname.indexOf(capitalcaseQuery) === 0);
  };
}

function _getSelectedSection() {
  return this.availableSections.filter(function(seccion) {
    return seccion.id === this.newReservationData.section;
  });
}

function checkAvailability(date, start, end) {
  start = this.$filter('amParse')(start, 'HH:mmA');
  end = this.$filter('amParse')(start, 'HH:mmA');
  this.Search.checkAvailability(date, start, end)
    .then(() => {
      this.creationForm.$setValidity('confirmTime', true);
      this.creationForm.$setValidity('endTime', true);
      this.creationForm.$setValidity('startTime', true);
    })
    .catch((err) => {
      if (err.name === 'ENDS_TOO_LATE') {
        this.creationForm.$setValidity('endTime', false);
      } else if (err.name === 'START_AT_SAME_TIME') {
        this.creationForm.$setValidity('startTime', false);
      } else {
        this.creationForm.$setValidity('confirmTime', false);
      }
    });
}

function _errHdlr(err) {
  console.error(err);
}
