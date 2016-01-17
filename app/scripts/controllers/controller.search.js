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
      .then(data => {
        this.query.heading = `${profesor.name}  ${profesor.lastname}`;
        if (data.length) {
          this.query.message = '';
          this.query.results = data;
        } else {
          this.query.message = `No hay reservaciones para ${this.query.heading}`;
        }

        this.query.needsDate = true;
      }).catch(_errHdlr);
  }

  searchByDate(date) {
    this.Search.searchReservacionByDate(date)
      .then(data => {
        this.query.heading = date.toLocaleDateString();

        if (data.length) {
          this.query.message = '';
          this.query.results = data;
        } else {
          this.query.message = `No hay reservaciones para ${this.query.heading}`;
        }

        this.query.needsDate = false;
      }).catch(_errHdlr);
  }

  searchByPeriod(period) {
    let {start, end} = period;
    let head = `${start.toLocaleDateString()} al ${end.toLocaleDateString()}`;

    this.Search.searchReservacionByPeriod(start, end)
      .then(data => {
        this.query.heading = `Periodo del ${head}`;
        if (data.length) {
          this.query.message = '';
          this.query.results = data;
        } else {
          this.query.message = `No hay reservaciones para ${this.query.heading}`;
        }

        this.query.needsDate = true;
      }).catch(_errHdlr);
  }

  queryProfesors(profesorName) {
    let response = profesorName ?
      this.profesorsList.filter(_createFilterFor(profesorName)) :
      this.profesorsList;
    return response;
  }
}

SearchController.$inject = ['Utilities', 'Profesores', 'Search'];

export default SearchController;

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
 * Just Log Errors From Promise in console
 * @param  {Error} err An error returned by a Promise
 */
function _errHdlr(err) {
  console.error(err);
}
