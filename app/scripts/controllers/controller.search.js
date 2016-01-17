class SearchController {
  constructor(Utilities, Profesores, Search) {
    this.Utilities = Utilities;
    this.Profesores = Profesores;
    this.Search = Search;
    this.profesorsList = Profesores.all;
  }

  active() {
    console.log('Searching...');
    _mdDatePickerFix();
    this.today = new Date();
    this.query = {
      message: 'Realiza una busqueda para poder ver los resultados'
    };
  }

  searchByProfesor(profesor) {
    this.Search.searchReservationsOf(profesor.$id)
      .then((data) => {
        this.query.heading = `${profesor.name}  ${profesor.lastname}`;
        if (!data.length) {
          this.query.message = `No hay reservaciones para ${this.query.heading}`;
        } else {
          this.query.message = '';
          this.query.results = data;
        }

        this.query.needsDate = true;
      }).catch(_errHndl);
  }

  searchByDate(date) {
    Search.searchReservacionByDate(date)
      .then((data) => {
        this.query.heading = date.toLocaleDateString();

        if (!data.length) {
          this.query.message = `No hay reservaciones para ${this.query.heading}`;
        } else {
          this.query.message = '';
          this.query.results = data;
        }

        this.query.needsDate = false;
      }).catch(_errHndl);
  }

  searchByPeriod(period) {
    let {
      start, end
    } = period;

    Search.searchReservacionByPeriod(start, end)
      .then((data) => {
        this.query.heading = `Periodo del ${start.toLocaleDateString()} al ${end.toLocaleDateString()}`;
        if (!data.length) {
          this.query.message = `No hay reservaciones para ${this.query.heading}`;
        } else {
          this.query.message = '';
          this.query.results = data;
        }

        this.query.needsDate = true;
      }).catch(_errHndl);
  }

  queryProfesors(profesorName) {
    let response = profesorName ? vm.profesorsList.filter(_createFilterFor(profesorName)) : vm.profesorsList;
    return response;
  }
}

SearchController.$inject = ['Utilities', 'Profesores', 'Search'];

export SearchController;

function _errHndl(err) {
  console.error(err);
}

function _mdDatePickerFix() {
  setTimeout(function() {
    var datePicker = $('.md-datepicker-input-container'),
      datePickerInput = datePicker.find('input'),
      datePickerButton = datePicker.find('button');
    datePickerInput.on('focus', function(event) {
      event.preventDefault();
      datePickerButton.trigger('click');
    });
  }, 250);
}

function _createFilterFor(query) {
  var capitalcaseQuery = query.charAt(0).toUpperCase() + query.slice(1).toLowerCase();
  return function filterFn(profesor) {
    return (profesor.name.indexOf(capitalcaseQuery) === 0) || (profesor.lastname.indexOf(capitalcaseQuery) === 0);
  };
}
