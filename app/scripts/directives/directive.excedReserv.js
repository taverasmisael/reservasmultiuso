import {autobind} from 'core-decorators';

class ExcedReservations {
  constructor(Search) {
    this.restrict = 'A';
    this.require = '^ngModel';
    this.Search = Search;
  }

  @autobind
  link(scope, elem, attrs, controller) {
    console.log(controller);
    controller.$asyncValidators.mtExcedReservations = (modelValue, viewValue) => {
      let promise = new Promise((resolve, reject) => {
        if (controller.$isEmpty(modelValue)) {
          // consider empty models to be valid
          resolve(false);
        }
        var profId = attrs.profid;
        if (!profId || !viewValue) {
          resolve(true);
        } else {
          this.Search.searchProfesorInMonth(profId, viewValue)
              .then(reservas => {
                if (reservas.length >= 2) {
                  console.log(`I'll run`);
                  reject(reservas);
                } else {
                  resolve(true);
                }
              }).catch(err => console.error(err));
        }
      });

      return promise;
    };
  }
}

ExcedReservations.$inject = ['Search'];

export default ExcedReservations;
